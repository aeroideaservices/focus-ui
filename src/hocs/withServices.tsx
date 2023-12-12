import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from '@mantine/hooks';

import { LS_KEY, ServiceCode } from '@/constants/services';

import { AppDispatch } from '@/store';
import {
  fetchServiceAction,
  selectCurrentService,
  selectServices,
  selectServicesMap,
  setCurrentService,
} from '@/store/slices/service/service';

export const withServices = function <P>(component: FC<P>) {
  return (props: P) => {
    const currentService = useSelector(selectCurrentService);
    const servicesMap = useSelector(selectServicesMap);
    const services = useSelector(selectServices);
    const dispatch: AppDispatch = useDispatch();
    const [serviceFromLS] = useLocalStorage<ServiceCode>({
      key: LS_KEY,
    });

    useEffect(() => {
      if (!currentService) dispatch(setCurrentService(serviceFromLS || services[0]?.code));
    }, [servicesMap, services]);

    useEffect(() => {
      if (!services.length) dispatch(fetchServiceAction());
    }, []);

    return component(props);
  };
};
