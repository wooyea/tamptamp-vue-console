import { callWithAsyncErrorHandling, cloneVNode, ComponentOptions, defineComponent, getCurrentInstance, isVNode, onBeforeUnmount, onMounted, onUpdated, queuePostFlushCb, RendererElement, RendererNode, setTransitionHooks, VNode, warn, watch } from "vue";
function queuePostRenderEffect(fn: any, suspense: any) {
  if (suspense && suspense.pendingBranch) {
    if (Array.isArray(fn)) {
      suspense.effects.push(...fn);
    }
    else {
      suspense.effects.push(fn);
    }
  }
  else {
    queuePostFlushCb(fn);
  }
}
const invokeArrayFns = (fns: any[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};

function invokeVNodeHook(hook: any, instance: any, vnode: any, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7 /* VNODE_HOOK */, [
    vnode,
    prevVNode
  ]);
}

function resetShapeFlag(vnode: any) {
  let shapeFlag = vnode.shapeFlag;
  if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
    shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
  }
  if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
    shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */;
  }
  vnode.shapeFlag = shapeFlag;
}
const isFunction = (val: any) => typeof val === 'function';
function getComponentName(Component: any) {
  return isFunction(Component)
    ? Component.displayName || Component.name
    : Component.name;
}

const isString = (val: any) => typeof val === 'string';
function matches(pattern: any, name: any): boolean {
  if (Array.isArray(pattern)) {
    return pattern.some((p) => matches(p, name));
  }
  else if (isString(pattern)) {
    return pattern.split(',').indexOf(name) > -1;
  }
  else if (pattern.test) {
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}
function getInnerChild(vnode: any) {
  return vnode.shapeFlag & 128 /* SUSPENSE */ ? vnode.ssContent : vnode;
}
const isAsyncWrapper = (i: any) => !!i.type.__asyncLoader;
export const KeepAliveImpl: ComponentOptions = {
  name: `KeepAlive`,
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props: any, { slots }: any) {
    const instance: any = getCurrentInstance();
    // KeepAlive communicates with the instantiated renderer via the
    // ctx where the renderer passes in its internals,
    // and the KeepAlive instance exposes activate/deactivate implementations.
    // The whole point of this is to avoid importing KeepAlive directly in the
    // renderer to facilitate tree-shaking.
    const sharedContext = instance.ctx;
    // if the internal renderer is not registered, it indicates that this is server-side rendering,
    // for KeepAlive, we just need to render its children
    if (!sharedContext.renderer) {
      return slots.default;
    }
    const cache = new Map();
    const keys = new Set();
    let current: any = null;

    const parentSuspense = instance.suspense;
    const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
    const storageContainer = createElement('div');
    sharedContext.activate = (vnode: any, container: any, anchor: any, isSVG: any, optimized: any) => {
      const instance = vnode.component;
      move(vnode, container, anchor, 0 /* ENTER */, parentSuspense);
      // in case props have changed
      patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
      queuePostRenderEffect(() => {
        instance.isDeactivated = false;
        if (instance.a) {
          invokeArrayFns(instance.a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
      }, parentSuspense);
    };
    sharedContext.deactivate = (vnode: any) => {
      const instance = vnode.component;
      move(vnode, storageContainer, null, 1 /* LEAVE */, parentSuspense);
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
        instance.isDeactivated = true;
      }, parentSuspense);
    };
    sharedContext.pruneCacheEntry = pruneCacheEntry;
    function unmount(vnode: any) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense, true);
    }
    function pruneCache(filter: any) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type);
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }
    function pruneCacheEntry(key: any) {
      const cached = cache.get(key);
      if (!current || cached.type !== current.type) {
        unmount(cached);
      }
      else if (current) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current);
      }
      cache.delete(key);
      keys.delete(key);
    }
    // prune cache on include/exclude prop change
    watch(() => [props.include, props.exclude], ([include, exclude]) => {
      include && pruneCache((name: any) => matches(include, name));
      exclude && pruneCache((name: any) => !matches(exclude, name));
    },
      // prune post-render after `current` has been updated
      { flush: 'post', deep: true });
    // cache sub tree after render
    let pendingCacheKey: any = null;
    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };
    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode);
          // but invoke its deactivated hook here
          const da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }
        unmount(cached);
      });
    });
    return () => {
      pendingCacheKey = null;
      if (!slots.default) {
        return null;
      }
      const children = slots.default();
      const rawVNode: any = children[0];
      if (children.length > 1) {
        {
          warn(`KeepAlive should contain exactly one component child.`);
        }
        current = null;
        return children;
      }
      else if (!isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & 4 /* STATEFUL_COMPONENT */) &&
          !(rawVNode.shapeFlag & 128 /* SUSPENSE */))) {
        current = null;
        return rawVNode;
      }
      let vnode = getInnerChild(rawVNode);
      const comp = vnode.type;
      // for async components, name check should be based in its loaded
      // inner component if available
      const name = getComponentName(isAsyncWrapper(vnode)
        ? vnode.type.__asyncResolved || {}
        : comp);
      const { include, exclude, max }: any = props;
      if ((include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))) {
        current = vnode;
        return rawVNode;
      }
      const key = vnode.key == null ? comp : vnode.key;
      const cachedVNode = cache.get(key);
      // clone vnode if it's reused because we are going to mutate it
      if (vnode.el) {
        vnode = cloneVNode(vnode);
        if (rawVNode.shapeFlag & 128 /* SUSPENSE */) {
          (rawVNode as any).ssContent = vnode;
        }
      }
      // #1513 it's possible for the returned vnode to be cloned due to attr
      // fallthrough or scopeId, so the vnode here may not be the final vnode
      // that is mounted. Instead of caching it directly, we store the pending
      // key and cache `instance.subTree` (the normalized vnode) in
      // beforeMount/beforeUpdate hooks.
      pendingCacheKey = key;
      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;
        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks(vnode, vnode.transition);
        }
        // avoid vnode being mounted as fresh
        vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */;
        // make this key the freshest
        keys.delete(key);
        keys.add(key);
      }
      else {
        keys.add(key);
        // prune oldest entry
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      }
      // avoid vnode being unmounted
      vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
      current = vnode;
      return rawVNode;
    };
  }
};
