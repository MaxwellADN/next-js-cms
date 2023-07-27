import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { deletePost, paginate, updatePost } from '../../actions/post.action';
import { PostInterface } from '../../interfaces/post.interface';
import { PaginationInterface } from '../../interfaces/pagination.interface';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { PostStateInterface } from '../../interfaces/post-state.interface';
import { POST_STATES } from '../../constants/post-state.constant';
import Link from 'next/link';

const PostList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<PostInterface>({});
  const { loading, posts, totalRecords, item }: PostStateInterface = useSelector((state) => state.postReducer);
  const first = (currentPage - 1) * pageSize;
  const router = useRouter();
  const menuRight = useRef(null);
  const toast = useRef(null);
  const menuItems = [
    {
      label: 'Publish',
      icon: 'pi pi-wifi',
      command: () => {
        publish()
      }
    },
    {
      label: 'Unpublish',
      icon: 'pi pi-globe',
      command: () => {
        unpublish()
      }
    },
    {
      label: 'View',
      icon: 'pi pi-eye',
      command: () => {
        if (selectedPost) {
          router.push('view?id=' + selectedPost.id)
        }
      }
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        if (selectedPost) {
          router.push('create?id=' + selectedPost.id)
        }
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        deleteSelectedPost();
      }
    }
  ];

  const publish = () => {
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        publish: true,
        state: POST_STATES[1].code, // Select publish index
      };
      const action = updatePost(selectedPost.id!, updatedPost, toast);
      dispatch(action);
      paginatePost();
    }
  }

  const unpublish = () => {
    if (selectedPost) {
      const updatedPost = {
        ...selectedPost,
        unpublish: true,
        state: POST_STATES[0].code, // Select unpublish index
      };
      const action = updatePost(selectedPost.id!, updatedPost, toast);
      dispatch(action);
      paginatePost();
    }
  }

  const deleteSelectedPost = () => {
    if (selectedPost) {
      const action = deletePost(selectedPost?.id!, toast);
      dispatch(action);
      paginatePost();
    }

  }

  const paginatePost = () => {
    const pagination: PaginationInterface = {
      page: currentPage,
      pageSize,
      searchTerm,
      sortDirection: 'asc', // Modify as per your requirement
      sortField: 'createdAt' // Modify as per your requirement
    };
    dispatch(paginate(pagination));
  }

  useEffect(() => {
    const pagination: PaginationInterface = {
      page: currentPage,
      pageSize,
      searchTerm,
      sortDirection: 'asc', // Modify as per your requirement
      sortField: 'createdAt' // Modify as per your requirement
    };
    dispatch(paginate(pagination));
  }, [dispatch, currentPage, pageSize, searchTerm]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setCurrentPage(event.page + 1);
  };

  const onPageSizeChange = (event: DropdownChangeEvent) => {
    setPageSize(event.value);
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const contentTagsBodyTemplate = (rowData: PostInterface) => {
    return rowData.tags?.join(', ');
  };

  const contentActionButtons = (post: PostInterface) => {
    return <>
      <Menu model={menuItems} popup ref={menuRight} id="popup_menu_right" />
      <Button
        text
        icon="pi pi-ellipsis-h"
        className="mr-2"
        onClick={(event) => {
          setSelectedPost(post);
          menuRight.current?.toggle(event)
        }}
        aria-controls="popup_menu_right"
        aria-haspopup />
    </>
  }

  const contentNameColumn = (rawData: PostInterface) => {
    return <div><Link href={'/posts/view?id=' + rawData.id}>{rawData?.name}</Link></div>
  }

  const handleClick = () => {
    router.push('/posts/create');
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-9">
          <Button label="Create" icon="pi pi-plus" className='mr-3' onClick={handleClick} />
          <Dropdown
            value={pageSize}
            options={[5, 10, 20, 30]} // Modify as per your requirement
            onChange={onPageSizeChange}
            placeholder="Items per page"
          />
        </div>
        <div className="col-3">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search posts..."
            />
          </div>
        </div>

        <div className="mt-3 col-12">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <DataTable
                value={posts}
                className="p-datatable-striped"
                emptyMessage="No posts found"
              >
                <Column body={contentNameColumn} header="Name" />
                <Column className='truncate' field="description" header="Description" />
                <Column field="url" header="Url" />
                <Column field="state" header="State" />
                <Column body={contentTagsBodyTemplate} header="Tags" />
                <Column body={contentActionButtons} />
              </DataTable>
              <Paginator first={first} rows={pageSize} totalRecords={totalRecords} onPageChange={onPageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
