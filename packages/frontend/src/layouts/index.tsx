/** @format */

import React from 'react';
import 'antd/dist/antd.css';
import {Layout, Menu, Icon} from 'antd';

const {Header, Content, Footer} = Layout;
import {Link} from 'umi';

export default class BasicLayout extends React.Component {
    render() {
        const {children} = this.props;

        return (
            <Layout className="layout" style={{minHeight: '100vh'}}>
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{lineHeight: '64px'}}>
                        <Menu.Item key="1">
                            <Link to="/">
                                <Icon type="down-square" />
                                Home
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/hd">
                                <Icon type="left-square" />
                                Create HD Segwit Address
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/p2sh">
                                <Icon type="right-square" />
                                Create P2SH Address
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <div style={{margin: '50px 0'}} />
                    <div style={{background: '#fff', padding: 24, minHeight: '75vh'}}>{children}</div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Bitcoin address generator ©2020 Created by Joe</Footer>
            </Layout>
        );
    }
}
