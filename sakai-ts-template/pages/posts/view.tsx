import { useDispatch, useSelector } from "react-redux";
import { PostStateInterface } from "../../interfaces/post-state.interface";
import { useEffect } from "react";
import { getPost } from "../../actions/post.action";
import { useRouter } from "next/router";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";

const PostView = () => {
    const { item }: PostStateInterface = useSelector((state) => state.postReducer);
    const router = useRouter();
    const { query } = router;
    const postId = query.id?.toString();
    const dispatch = useDispatch();

    useEffect(() => {
        const action = getPost(postId!);
        dispatch(action);
      }, []);

    return (<div>
        <Card>
            <div className="grid">
                <div className="col-12">
                    <h2>{item?.name}</h2>
                    <small>{item?.description}</small><br />
                    <small>State: {item?.state}</small>
                </div>
                <div className="mt-5 col-12">
                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: item?.content! }}></div>
                </div>
                <div className="col-12 mt-5">
                    {item?.tags?.map((tag, index) => (
                        <Chip key={index} label={tag} className="mr-2" />
                    ))}
                </div>
            </div>
        </Card>

    </div>)
}

export default PostView;