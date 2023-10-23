import {useState} from 'react';

import {InputAdornment, OutlinedInput} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {DragDropContext, DropResult} from '@hello-pangea/dnd';

import {Kanvan, PageTitle} from '@/components';

import {dummyTicketData, dummyUsers} from '@/contants';

import {ItemType} from '@/types';

import {TaskDetailModal} from '../TaskDetailModal';
import {Wrapper} from './style';

interface Column {
  title: string;
  items: ItemType[];
}

export const DashBoard = () => {
  const [columns, setColumns] = useState<{[key: string]: Column}>(
    dummyTicketData,
  );
  const [isModalOpen, setIsModalOpen] = useState(false); //상세내용 모달창 상태
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null); //task card 선택 상태

  const onDragEnd = (
    result: DropResult,
    columns: {[key: string]: Column},
    setColumns: (value: {[key: string]: Column}) => void,
  ) => {
    if (!result.destination) return;
    console.log(result);
    const {source, destination} = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <Wrapper>
      <PageTitle title="FRON 보드" />
      <div className="search-wrapper">
        <OutlinedInput
          sx={{
            color: '#fff',
            fontSize: '1.6rem',
            borderRadius: '2px',
            outline: '3px solid #20212D',
            background: '#363743',
          }}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon
                sx={{
                  color: '#fff',
                  fontSize: '2.4rem',
                }}
              />
            </InputAdornment>
          }
        />
        <div className="user-wrapper">
          {dummyUsers.map(user => (
            <div className="user-icon" key={user.id}>
              {user.name}
            </div>
          ))}
          <div className="user-icon add-btn">+</div>
        </div>
      </div>
      <div className="kanban-wrapper">
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          <Kanvan
            columns={columns}
            isModalOpen={isModalOpen}
            selectedItem={selectedItem}
            setIsModalOpen={setIsModalOpen}
            setSelectedItem={setSelectedItem}
          />
        </DragDropContext>
      </div>
      {selectedItem && (
        <TaskDetailModal
          isModalOpen={isModalOpen}
          selectedItem={selectedItem}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </Wrapper>
  );
};
