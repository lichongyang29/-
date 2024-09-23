import { View, Text } from 'react-native';
import React from 'react';
import { Dialog, Portal } from 'react-native-paper';
import { HStack, Heading, Spinner } from 'native-base';

interface LoadingProps {
  state: boolean;
}

const Loading: React.FC<LoadingProps> = ({ state }) => {
  return (
    <Portal>
      <Dialog visible={state} dismissable={false}>
        <Dialog.Content>
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default Loading;
