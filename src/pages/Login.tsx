import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styles from './Login.module.scss';

interface LoginProps extends RouteComponentProps, FormComponentProps {
  [key: string]: any;
}

function Login({ form, history }: LoginProps) {
  const { getFieldDecorator } = form;

  return (
    <div className={styles.wrap}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          form.validateFields((err: any, values: any) => {
            if (!err) {
              // eslint-disable-next-line no-console
              console.log('Received values of form: ', values);
            }
          });
        }}
      >
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
        </Form.Item>

        <div className={styles.footer}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <Button type="primary" onClick={() => history.goBack()}>
            后退
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Form.create()(Login);
