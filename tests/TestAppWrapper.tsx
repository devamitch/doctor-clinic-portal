import {QueryClientProvider} from '@tanstack/react-query';
import {type PropsWithChildren} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import '@/translations';

import {queryClient} from '@/App';

function TestAppWrapper({children}: PropsWithChildren) {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default TestAppWrapper;
