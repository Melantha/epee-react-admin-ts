import { Icon, Layout, Menu } from 'antd';
import _ from 'lodash';
import React from 'react';
import {
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from 'react-router-dom';
import styles from './BasicLayout.module.scss';

const { Header, Sider, Content } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

export type RouteType = Pick<RouteProps, 'component' | 'exact' | 'strict'> &
  Omit<MenuDataItem, 'children' | 'routes' | 'component'>;
export interface MenuDataItem {
  path: string;
  name: string;
  icon?: string;
  hideInMenu?: boolean;
  children?: MenuDataItem[];
  component?: React.ReactNode;
  routes?: RouteType[];
}

function renderMenu(menu: MenuDataItem[]) {
  return menu.map(m => {
    if (m.hideInMenu) {
      return null;
    }
    if (!_.isEmpty(m.children) || !_.isEmpty(m.routes)) {
      return (
        <SubMenu
          key={m.path}
          title={
            <span>
              {m.icon && <Icon type={m.icon} />}
              <span>{m.name}</span>
            </span>
          }
        >
          {!_.isEmpty(m.children)
            ? renderMenu(m.children!)
            : renderMenu(m.routes!)}
        </SubMenu>
      );
    }

    return (
      <MenuItem key={m.path}>
        {m.icon && <Icon type={m.icon} />}
        <span>{m.name}</span>
      </MenuItem>
    );
  });
}

function renderRoute(menu: MenuDataItem[]): any[] {
  return menu.map(m => {
    if (m.hideInMenu) {
      return null;
    }
    if (!_.isEmpty(m.children) || !_.isEmpty(m.routes)) {
      return !_.isEmpty(m.children)
        ? renderRoute(m.children!)
        : renderRoute(m.routes!);
    }

    const { name, hideInMenu, icon, ...routeProps } = m as any;

    return <Route key={routeProps.path} {...routeProps} />;
  });
}

interface BasicLayoutProps extends RouteComponentProps {
  menuData: MenuDataItem[];
  collapsed?: boolean;
  children?: React.ReactNode;
}

export default function BasicLayout({
  menuData,
  history,
  location: { pathname },
  children,
  collapsed = false,
}: BasicLayoutProps) {
  const paths = _.dropRight(pathname.split('/'), 1);
  const openKeys = paths.map((m, i) => _.take(paths, i + 1).join('/'));

  return (
    <Layout>
      <Sider width={256} collapsed={collapsed}>
        <div className={styles.logo}>Epee Admin</div>
        <Menu
          mode="inline"
          theme="dark"
          defaultOpenKeys={openKeys}
          selectedKeys={[pathname]}
          onSelect={param => history.push(param.key)}
        >
          {renderMenu(menuData)}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>{children}</Header>
        <Content>
          <Switch>{_.flattenDeep(renderRoute(menuData))}</Switch>
        </Content>
      </Layout>
    </Layout>
  );
}
