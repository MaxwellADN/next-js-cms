import { Menubar } from "primereact/menubar";
import { CommentInterface } from "./comment.interface";
import { OptionInterface } from "./option.interface";
import { PostStateInterface } from "./post-state.interface";
import { TenantInterface } from "./tenant.interface";
import { UserInterface } from "./user.interface";

export interface PostInterface {
    id?: string;
    createdAt?: Date;
    updateAt?: Date;
    name?: string;
    description?: string;
    content?: string;
    url?: string;
    option?: OptionInterface;
    state?: string;
    tags?: string[];
    showMenu?: boolean;
    publish?: boolean;
    unpublish?: boolean;
    comments?: CommentInterface[];
    author?: UserInterface;
    tenant?: TenantInterface;
    menuRef?: Menubar | null; // Add the menuRef property
}