import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, GetProp, message, Typography, Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { updateAvatar } from '@/services/user';
import { userStore } from '@/zustand/user';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const Profile = () => {
    const user = userStore();
    const [imageUrl, setImageUrl] = useState<string>();
    const [file, setFile] = useState<RcFile>();

    const uploadHandler = async () => {
        const formData = new FormData();
        console.log(file);
        formData.append('avatar', file as Blob);
        try {
            const response = await updateAvatar(formData);
            if (!response.data.data?.avatar) {
                throw new Error('Update avatar failed');
            }
            console.log(response.data.data.avatar);
            user.setAvatar(response.data.data.avatar);
            message.success('Update avatar success');
        } catch (error) {
            console.error(error);
            message.error('Update avatar failed');
        }
    };

    return (
        <Flex justify="start" gap={320} align="center">
            <Flex vertical gap={24}>
                <Flex gap={36} justify="start" align="center">
                    <Typography.Title
                        level={4}
                        style={{
                            margin: 0,
                        }}
                    >
                        Username
                    </Typography.Title>
                    <Typography.Text style={{ marginTop: 2 }} editable>
                        {user.user.user.username}
                    </Typography.Text>
                </Flex>

                <Flex gap={36} justify="start" align="center">
                    <Typography.Title
                        level={4}
                        style={{
                            margin: 0,
                        }}
                    >
                        Email
                    </Typography.Title>
                    <Typography.Text style={{ marginTop: 2 }}>
                        {user.user.user.email}
                    </Typography.Text>
                </Flex>

                <Button type="primary" size="large">
                    Update Profile
                </Button>
            </Flex>
            <Flex justify="center" align="center" vertical gap={24}>
                <Avatar
                    size={128}
                    src={imageUrl ? imageUrl : user.user.user.profile.avatar.url}
                    icon={<UserOutlined />}
                />
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        console.log(file);
                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                        if (!isJpgOrPng) {
                            message.error('You can only upload JPG/PNG file!');
                            return false;
                        }

                        const isLt2M = file.size / (1024 * 1024) <= 1;
                        if (!isLt2M) {
                            message.error('Image must smaller than 2MB!');
                            return false;
                        }
                        setImageUrl(URL.createObjectURL(file as FileType));
                        setFile(file);
                        return false;
                    }}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Flex vertical gap={12}>
                    <Typography.Text type="secondary">Max capacity is 1MB</Typography.Text>
                    <Typography.Text type="secondary">File Format: jpg/png</Typography.Text>
                </Flex>
                <Button
                    type="primary"
                    size="large"
                    disabled={imageUrl ? false : true}
                    onClick={uploadHandler}
                >
                    Update Avatar
                </Button>
            </Flex>
        </Flex>
    );
};

export default Profile;
