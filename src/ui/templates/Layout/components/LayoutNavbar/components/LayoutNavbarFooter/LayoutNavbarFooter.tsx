import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { IconDoorExit } from '@tabler/icons-react';

import LayoutNavbarButton from '../LayoutNavbarButton/LayoutNavbarButton';
import LayoutNavbarSelect from '../LayoutNavbarSelect/LayoutNavbarSelect';

import { AppDispatch } from '@/store';
import { logout } from '@/store/slices/auth/auth';

const LayoutNavbarFooter: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout(null));
  };

  return (
    <>
      <LayoutNavbarSelect />

      <LayoutNavbarButton onClick={handleLogOut} label="Выйти" icon={<IconDoorExit size={24} />} />
    </>
  );
};

export default LayoutNavbarFooter;
