import React, { useEffect, useRef, useState } from 'react';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'quill/dist/quill.snow.css';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { PostInterface } from '../../interfaces/post.interface';
import { Button } from 'primereact/button';
import { POST_STATES } from '../../constants/post-state.constant';
import { Card } from 'primereact/card';
import { createPost, getPost, updatePost } from '../../actions/post.action';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from "redux";
import { Action } from '../../app-types/action.type';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { PostStateInterface } from '../../interfaces/post-state.interface';

const CreatePost = () => {
    const { item }: PostStateInterface = useSelector((state) => state.postReducer);
    const router = useRouter();
    const dispatch = useDispatch<Dispatch<Action<PostInterface>>>();
    const toast = useRef(null);
    const [post, setPost] = useState<PostInterface>({
        name: '',
        description: '',
        content: '',
        url: '',
        state: '',
        tags: []
    });
    const { query } = router;
    const postId = query.id?.toString();

    useEffect(() => {
        if (postId) {
            const action = getPost(postId!);
            dispatch(action);
            setPost({ ...item, content: item?.content, option: POST_STATES.find((p) => p.code === item?.state)  });
        }
    }, []);

    const handleCreatePost = async (event: any) => {
        event.preventDefault();
        if (!postId) {
            const action = createPost(post, router, toast);
            dispatch(action);
        } else {
            const action = updatePost(item?.id!, post, toast);
            dispatch(action);
        }
    };

    const handleEditorChange = (value: EditorTextChangeEvent) => {
        setPost((prevPost) => ({
            ...prevPost,
            content: value.htmlValue!
        }));
    }


    return (
        <div>
            <Card title="Create a new post">
                <form onSubmit={handleCreatePost}>
                    <div className="grid">
                        <div className="col-12">
                            <div className="card p-fluid">
                                <div className="field">
                                    <label>Name </label>
                                    <InputText
                                        placeholder='Name'
                                        value={post.name}
                                        onChange={(e) => setPost({ ...post, name: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Description </label>
                                    <InputTextarea
                                        autoResize
                                        value={post.description}
                                        onChange={(e) => {
                                            setPost({ ...post, description: e.target.value })
                                        }}
                                        rows={4}
                                        cols={40} />
                                </div>
                                <div className="field">
                                    <label>Content </label>
                                    <Editor
                                        style={{ height: '40vh' }}
                                        value={post.content}
                                        onTextChange={handleEditorChange} />
                                </div>
                                <div className="field">
                                    <label>URL</label>
                                    <InputText placeholder='URL' value={post.url} onChange={(e) => setPost({ ...post, url: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Tags</label>
                                    <Chips value={post.tags} onChange={(e) => setPost({ ...post, tags: e.value! })} />
                                </div>
                                <div className="field">
                                    <label>State</label>
                                    <Dropdown
                                        value={post.option}
                                        onChange={(e) => setPost({ ...post, option: e.value, state: e.value.code })}
                                        options={POST_STATES}
                                        optionLabel="name"
                                        placeholder="Select a state"
                                        className="w-full md:w-14rem"
                                    />
                                </div>
                                <div className="field">
                                    <Button label="Submit" type='submit' />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
            <Toast ref={toast} position="bottom-center" />
        </div>
    );
}

export default CreatePost;
