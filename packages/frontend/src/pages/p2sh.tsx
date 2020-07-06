/** @format */

import {Button, Form, Input, Icon, InputNumber, message, Typography} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import * as React from 'react';
import {request} from '../service/index';
import 'antd/dist/antd.css';
import TextArea from 'antd/lib/input/TextArea';

const {Title, Paragraph, Text} = Typography;

type P2SHFormProps = FormComponentProps;

let id = 0;

class P2SHForm extends React.Component<P2SHFormProps> {
    constructor(props: P2SHFormProps) {
        super(props);
    }

    remove = k => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {keys, names} = values;
                const data = {
                    pubkeys: keys.map(key => names[key]),
                    m: this.props.form.getFieldValue('m'),
                };
                try {
                    request
                        .post('/wallet/P2SHAddress', {data})
                        .then(function (response) {
                            _this.props.form.setFieldsValue({address: response.address});
                        })
                        .catch(function (error) {
                            console.log(error);
                            alert('Failed to generate address, please verify the input values!');
                        });
                } catch (error) {
                    message.error(JSON.stringify(error));
                }
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 8},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 16,
                    offset: 8,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        getFieldDecorator('keys', {initialValue: []});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item {...formItemLayout} label="Key" required={false} key={k}>
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: 'Public key is required.',
                        },
                    ],
                })(<Input allowClear style={{width: '90%', marginRight: 8}} />)}
                {keys.length > 1 ? (
                    <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)} />
                ) : null}
            </Form.Item>
        ));

        return (
            <React.Fragment>
                <Typography>
                    <Title>Multisig Address Generator</Title>
                    <Paragraph>
                        Clicking the button <Text strong>"Add public key"</Text> to create new entry for public keys.
                        Enter the public keys of all the participants, to create a multi signature address.
                        <Text strong>Maximum of 15 allowed.</Text>
                    </Paragraph>
                    <Paragraph>
                        Clicking the "Generate" button after you enter required fields, then address will be generated
                        in the bottom the
                        <Text strong>Address box.</Text>
                    </Paragraph>
                </Typography>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    {formItems}
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="dashed" onClick={this.add}>
                            <Icon type="plus" /> Add public key
                        </Button>
                    </Form.Item>
                    <Form.Item label="M" wrapperCol={{span: 2}}>
                        {getFieldDecorator(`m`, {
                            initialValue: 1,
                        })(<InputNumber min={1} max={15} />)}
                    </Form.Item>
                    <Form.Item label="Address">
                        {getFieldDecorator(`address`, {})(<TextArea rows={2} readOnly={true} />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Generate
                        </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}

const P2SHPage = Form.create()(P2SHForm);
export default P2SHPage;
