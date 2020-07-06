/** @format */

import {Button, Form, Input, message, Typography} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import * as React from 'react';
import TextArea from 'antd/lib/input/TextArea';
import {request} from '../service/index';

const {Title, Paragraph, Text} = Typography;

type HDFormProps = FormComponentProps;

class HDForm extends React.Component<HDFormProps> {
    constructor(props: HDFormProps) {
        super(props);
    }

    handleGetSeed = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const _this = this;
        try {
            request
                .get('/wallet/seed')
                .then(function (response) {
                    _this.props.form.setFieldsValue({seed: response.seed});
                })
                .catch(function (error) {
                    console.log(error);
                    alert('Failed to generate seed!');
                });
        } catch (error) {
            message.error(JSON.stringify(error));
        }
    };

    handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const data = {
                    seed: this.props.form.getFieldValue('seed'),
                    path: this.props.form.getFieldValue('path'),
                };
                try {
                    request
                        .post('/wallet/P2WPKHAddress', {data})
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
        const {getFieldDecorator} = this.props.form;

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
                xs: {span: 16, offset: 8},
                sm: {span: 8, offset: 8},
            },
        };

        return (
            <React.Fragment>
                <Typography>
                    <Title>HD Segwit Address Generator</Title>
                    <Paragraph>
                        You can either enter an existing seed, or generate a new random one clicking the{' '}
                        <Text strong>"Get random seed"</Text> button. When you get a seed and enter required path, then
                        clicking the "Generate" button, then address will be generated in the bottom the address box.
                    </Paragraph>
                </Typography>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Seed">
                        {getFieldDecorator(`seed`, {
                            rules: [{required: true, min: 128, message: 'This filed cannot be less than 128 chars'}],
                        })(<TextArea rows={3} allowClear/>)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button onClick={this.handleGetSeed}>Get random seed</Button>
                    </Form.Item>
                    <Form.Item label="Path">
                        {getFieldDecorator(`path`, {
                            initialValue: 'm/80/0/0/0/6',
                            rules: [{required: true, message: 'This field cannot be empty'}],
                        })(<Input allowClear/>)}
                    </Form.Item>
                    <Form.Item label="Address">
                        {getFieldDecorator(`address`, {})(<TextArea rows={2} readOnly={true}/>)}
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

const HDPage = Form.create()(HDForm);
export default HDPage;
