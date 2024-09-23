import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Dialog, Portal } from 'react-native-paper';
import { HStack, Heading, Spinner } from 'native-base';

interface LoadingProps {
  state: boolean;
  content: string;
}
const NoticeModal: React.FC<LoadingProps> = ({ state, content }) => {
  return (
    <Portal>
      <Dialog visible={state} dismissable={false}>
        <Dialog.Content>
          <HStack space={2} justifyContent="center">
            <Heading color="primary.500" fontSize="md">
              {content}
            </Heading>
          </HStack>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default NoticeModal;

const styles = StyleSheet.create({});
