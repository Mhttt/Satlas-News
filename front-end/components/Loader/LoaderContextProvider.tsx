import React, {useState, createContext, FC, ReactNode} from 'react'
import Loader from './Loader';

type loaderVariant = 'blocking' | 'topbar';

interface LoaderValues {
  state: {
    loadingData: boolean;
    variant: loaderVariant;
  };
  actions: {
    displayLoader: (loaderType: loaderVariant) => void;
    dataIsLoaded: () => void;
  };
}

type Context = LoaderValues;

export const LoaderContext = createContext<Context>(
  null as unknown as LoaderValues
);

interface Props {
  children: ReactNode;
}

const LoaderContextProvider: FC<Props> = ({children}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [variant, setVariant] = useState<loaderVariant>('blocking');
  
  const displayLoader = (type: loaderVariant) => {
    setLoadingData(true);
    setVariant(type);
  }

  const dataIsLoaded = () => {
    setLoadingData(false);
  }

  return (
    <LoaderContext.Provider
      value={{
        state: {
          loadingData,
          variant,
        },
        actions: {
          displayLoader,
          dataIsLoaded,
        },
      }}
    >
      <Loader isLoading={loadingData} variant={variant} />
      {children}
    </LoaderContext.Provider>
  )
}

export default LoaderContextProvider