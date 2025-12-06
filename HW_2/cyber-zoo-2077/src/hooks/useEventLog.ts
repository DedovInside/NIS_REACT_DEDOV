import { useEventContext } from '../context/EventContext';

export const useEventLog = () => {
  const { events, addEvent, clearEvents } = useEventContext();

  const logPetAction = (petName: string, action: string) => {
    addEvent(`${petName} performed action: ${action}`);
  };

  return {
    events,
    logPetAction,
    clearEvents
  };
};
