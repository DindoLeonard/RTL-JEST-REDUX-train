import { NavigateFunction, useNavigate } from 'react-router-dom';

const useNavigateHook = (): NavigateFunction => {
  const navigate = useNavigate();

  return navigate;
};

export default useNavigateHook;
