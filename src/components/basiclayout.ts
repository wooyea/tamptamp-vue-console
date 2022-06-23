import {
  defineComponent, provide, reactive, toRefs,
} from 'vue';
import MultiTab from '@/components/MultiTab';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import MultiRouterView from '@/components/MultiRouterView/index.vue';
import SubMenu from '@/components/SubMenu/index.vue';

export default defineComponent({
  name: 'BasicLayout',
  components: {
    MultiRouterView,
    MultiTab,
    SubMenu,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup() {
    const dataMap = reactive({
      menuList: [] as any,
      openKeys: [] as any,
      multiTab: null as any,
      openChange(keys: any[]) {
        dataMap.openKeys = keys;
      },
      collapsed: false,
      siderStyle: {
        'max-width': '224px',
        'min-width': '224px',
        width: '224px',
      },
      sideSearchStyle: {
        width: '165px',
      } as any,
      toggleCollapsed() {
        dataMap.collapsed = !dataMap.collapsed;
        dataMap.siderStyle = dataMap.collapsed
          ? {
            'max-width': '48px',
            'min-width': '48px',
            width: '48px',
          }
          : {
            'max-width': '224px',
            'min-width': '224px',
            width: '224px',
          };
        dataMap.sideSearchStyle = dataMap.collapsed
          ? {
            width: '0px',
          }
          : {
            width: '165px',
          };
      },
      searchValue: '',
      findMenu() {
        const openKeys: any[] = [];
        if (dataMap.searchValue) {
          const findFunction = (array: any[], value: any) => {
            array.forEach((element) => {
              if (element.children && element.children.length !== 0) {
                findFunction(element.children, value);
                if (element.children.some((item: any) => item.name.indexOf(value) !== -1)) {
                  openKeys.push(element.id);
                }
              }
            });
          };
          findFunction(dataMap.menuList, dataMap.searchValue);
        }
        dataMap.openKeys = openKeys;
      },
    });

    provide('close', (e: any) => {
      dataMap.multiTab.closeThat(e);
    });
    const getMenusInfo = async () => {
      const data: any[] = [
        {
          id: 1,
          parentId: 0,
          name: '主页',
          url: '/index',
        },
        {
          id: 2,
          parentId: 0,
          name: 'iframe页面层级嵌套',
        },
        {
          id: 3,
          parentId: 2,
          name: 'iframe页面1 - B站',
          url: 'https://www.bilibili.com',
          pageType: 'iframe',
        },
        {
          id: 4,
          parentId: 2,
          name: 'iframe页面2 - 菜鸟教程',
          url: 'https://www.runoob.com/',
          pageType: 'iframe',
        },
      ];
      const list: any[] = [];
      const maps: any = {};
      data.forEach((x) => {
        if (x.parentId == '0') {
          list.push(x);
        }
        maps[x.id] = x;
      });
      data.forEach((x) => {
        const { parentId } = x;
        if (x.parentId != 0) {
          if (!maps[parentId].children) {
            maps[parentId].children = [];
          }
          maps[parentId].children.push(x);
        }
      });
      dataMap.menuList = list;
    };
    getMenusInfo();

    return { ...toRefs(dataMap) };
  },
});
