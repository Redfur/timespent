import { AddOutlined, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useGroupsStore } from '../store/groupsStore';
import type { SpentItem } from '../types';
import { SalaryInput } from './SalaryInput';
import { WorkTimeInput } from './WorkTimeInput';

const GroupOfSpent = ({
  id,
  color,
  name,
  description,
  items,
}: {
  id: string;
  color: string;
  name: string;
  description: string;
  items: SpentItem[];
}) => {
  const { addSpentItem, removeSpentItem, updateSpentItem } = useGroupsStore();
  const handleChangeName = (spentId: string, name: string) => {
    updateSpentItem(id, spentId, { name });
  };
  const handleChangeSpent = (spentId: string, spent: number) => {
    updateSpentItem(id, spentId, { spent });
  };
  return (
    <div>
      <h3>
        {name}
        <Box
          display="inline-block"
          sx={{ width: 100, height: 10, backgroundColor: color, marginLeft: 4 }}
        />
      </h3>
      <p>{description}</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Box display="flex" alignItems="center">
              <TextField
                placeholder="Название"
                variant="standard"
                value={item.name}
                onChange={e => handleChangeName(item.id, e.target.value)}
              />
              <TextField
                placeholder="Сумма"
                variant="standard"
                onChange={e =>
                  handleChangeSpent(item.id, Number(e.target.value) || 0)
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">&#8381;</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {item.spentBy}
                      </InputAdornment>
                    ),
                  },
                }}
                value={item.spent}
              />
              <IconButton
                onClick={() => {
                  removeSpentItem(id, item.id);
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </li>
        ))}
        <li>
          <Button onClick={() => addSpentItem(id)} startIcon={<AddOutlined />}>
            Добавить еще расходы
          </Button>
        </li>
      </ul>
    </div>
  );
};

export const TimeSpentCalculator = () => {
  const { groups } = useGroupsStore();
  return (
    <>
      <h1>Ради чего вы работаете?</h1>
      <Stack spacing={2}>
        <WorkTimeInput />
        <SalaryInput />
        <div>
          <Card>
            <CardHeader title="Расходы по группам" />
            <CardContent>
              {groups.map(group => (
                <GroupOfSpent
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  color={group.color}
                  description={group.description}
                  items={group.items}
                />
              ))}
              <Button startIcon={<AddOutlined />}>Добавить еще группу</Button>
            </CardContent>
          </Card>
        </div>
        {/* TODO: expenses form */}
        {/* TODO: results */}
      </Stack>
    </>
  );
};
