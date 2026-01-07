import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateGRScreen from "@/screens/CreateGRScreen";
import AttachmentsScreen from "@/screens/AttachmentsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CreateGRStackParamList = {
  CreateGR: undefined;
  Attachments: { grnId?: string };
};

const Stack = createNativeStackNavigator<CreateGRStackParamList>();

export default function CreateGRStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="CreateGR"
        component={CreateGRScreen}
        options={{
          headerTitle: "Create GR",
        }}
      />
      <Stack.Screen
        name="Attachments"
        component={AttachmentsScreen}
        options={{
          headerTitle: "Attachments",
        }}
      />
    </Stack.Navigator>
  );
}
