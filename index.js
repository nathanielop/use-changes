import { useMemo, useRef, useState } from 'react';

const useEvent = fn => {
  const ref = useRef();
  ref.current = fn;
  return ref.current;
};

export default ({ initial, trackChanges }) => {
  const [changes, _setChanges] = useState({});
  const [changeLog, setChangeLog] = useState([]);
  const [pointer, setPointer] = useState(0);

  const redo = useEvent(() => {
    if (!trackChanges || !changeLog[pointer + 1]) return;
    setChanges(changes => ({ ...changes, ...changeLog[pointer + 1] }));
    setPointer(pointer => ++pointer);
  });

  const undo = useEvent(() => {
    if (!trackChanges || !changeLog[pointer - 1]) return;
    setChanges(changes => ({ ...changes, ...changeLog[pointer - 1] }));
    setPointer(pointer => --pointer);
  });

  const setChanges = useEvent(changes => {
    if (trackChanges) { 
      setPointer(0);
      setChangeLog([]);
    }
    return _setChanges(changes);
  });

  const addChanges = useEvent(diff => {
    setChanges(changes => {
      if (trackChanges) { 
        setChangeLog(log => [...log.slice(0, pointer), diff]);
        setPointer(pointer => ++pointer);
      }
      return { ...changes, ...diff };
    });
  });

  const changed = useMemo(
    () => ({ ...initial, ...changes }),
    [changes, initial]
  );

  return { 
    addChanges, 
    changed, 
    changes,
    redo, 
    setChanges, 
    undo
  };
};
