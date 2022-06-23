
import _ from 'lodash'
import { defineComponent, reactive, toRefs, watch, getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import './index.less';
import { SyncOutlined, CloseOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'MultiTab',
  components: {
    SyncOutlined,
    CloseOutlined
  },
  setup() {
    const { proxy }: any = getCurrentInstance()
    const $root = proxy.$root
    const route = useRoute()

    const dataMap = reactive({
      fullPathList: [] as any[],
      pages: [] as any[],
      titles: {},
      activeKey: '',
      newTabIndex: 0,
      routes: [] as any,
      onClickTab(routeValue: any, key: any) {
        (dataMap as any)[key](routeValue)
      },
      remove(targetKey: any) {
        $root.delCache(targetKey);
        this.pages = this.pages.filter((page) => page.fullPath !== targetKey)

        this.fullPathList = this.fullPathList.filter((path) => path !== targetKey)
        // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
        if (!this.fullPathList.includes(this.activeKey)) {
          this.selectedLastPath()
        }
      },
      selectedLastPath() {
        if (this.fullPathList.length) {
          this.activeKey = this.fullPathList[this.fullPathList.length - 1]
        }
      },
      closeThat(e: any) {
        // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
        if (this.fullPathList.length > 1) {
          this.remove(e)
        }
      },
      refresh(e: string | number) {
        $root.reload(e);
      },
      closeLeft(e: any) {
        const currentIndex = this.fullPathList.indexOf(e)
        if (currentIndex > 0) {
          this.fullPathList.forEach((item: string | number, index: number) => {
            if (this.routes[item]) {
              const pinned = _.result(this.routes[item], 'meta.pinned', false)
              if (!pinned && index < currentIndex) {
                this.remove(item)
              }
            }
          })
        } else {
          message.info('左侧没有标签页')
        }
      },
      closeRight(e: any) {
        const currentIndex = this.fullPathList.indexOf(e)
        if (currentIndex < this.fullPathList.length - 1) {
          this.fullPathList.forEach((item: string | number, index: number) => {
            if (this.routes[item]) {
              const pinned = _.result(this.routes[item], 'meta.pinned', false)
              if (!pinned && index > currentIndex) {
                this.remove(item)
              }
            }
          })
        } else {
          message.info('右侧没有标签页')
        }
      },
      closeAll(e: any) {
        const currentIndex = this.fullPathList.indexOf(e)
        this.fullPathList.forEach((item: string | number, index: any) => {
          if (this.routes[item]) {
            const pinned = _.result(this.routes[item], 'meta.pinned', false)
            if (!pinned && index !== currentIndex) {
              this.remove(item)
            }
          }
        })
      },
      titleResolver(page: any): any {
        let title = page.meta.title
        if (page.query.bsId && page.query.bsId.length != 0) {
          title += '[' + page.query.bsId + ']'
        }
        if (page.query.defineTitle) {
          title = page.query.defineTitle
        }
        return title
      },
    })
    watch(
      () => route.fullPath,
      newFullPath => {
        dataMap.activeKey = newFullPath;
        dataMap.routes[newFullPath] = proxy.$route;
        if (dataMap.fullPathList.indexOf(newFullPath) < 0) {
          dataMap.fullPathList.push(newFullPath)
          dataMap.pages.push(proxy.$route)
        }
      }
    )

    watch(
      () => dataMap.activeKey,
      newPathKey => {
        proxy.$router.push(newPathKey).catch((_: any) => {
          console.log('push route failed, ignored if duplicated')
        })
      }
    )

    onMounted(() => {
      if (route.path != '/') {
        dataMap.pages.push(proxy.$route)
        dataMap.routes[route.fullPath] = proxy.$route
        dataMap.fullPathList.push(proxy.$route.fullPath)
      }

      dataMap.selectedLastPath()
    })

    return {
      ...toRefs(dataMap)
    }
  },
  render() {

    const renderTabPaneMenu = (e: any, customRefresh: any) => {
      const pinned = this.pages.length > 1 && this.pages.find((item: any) => item.fullPath == e).meta.pinned
      const showRefresh = e === this.activeKey && customRefresh === true

      return (
        <a-menu
          onClick={(dom: any) => {
            this.onClickTab(e, dom.key)
          }}
        >
          {!pinned ? <a-menu-item key="closeThat">关闭标签</a-menu-item> : ''}
          {showRefresh ? <a-menu-item key="refresh">刷新标签</a-menu-item> : ''}
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭其他</a-menu-item>
        </a-menu>
      )
    }

    const renderTabPane = (title: any, page: any) => {
      const menu = renderTabPaneMenu(page.fullPath, page.meta?.customRefresh)
      const showClose = this.pages.length > 1 && page.meta.pinned != true;
      const showRefresh = page.fullPath === this.activeKey && page.meta?.customRefresh === true
      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span>
            {title}
            {showRefresh ?
              <SyncOutlined
                class="tab-tool-button"
                onClick={(e) => { e.stopPropagation(); this.refresh(page.fullPath) }} />
              : ''
            }
            {showClose ?
              <CloseOutlined
                class="tab-tool-button"
                onClick={(e) => { e.stopPropagation(); this.closeThat(page.fullPath) }} />
              : ''
            }
          </span>
        </a-dropdown>
      )
    }

    const panes = this.pages.map((page: any) => {
      const title = this.titleResolver(page);
      return (
        <a-tab-pane
          tab={renderTabPane(title, page)}
          key={page.fullPath}
          closable={false}
        >
        </a-tab-pane>
      )
    })

    return (
      <div class="admin-tabs">
        <a-tabs
          hideAdd
          type={'editable-card'}
          v-model={[this.activeKey, 'activeKey']}
          tabBarStyle={{ background: '#ffffff', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
        >
          {panes}
        </a-tabs>
      </div>
    )
  }
})
