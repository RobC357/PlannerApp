import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const CustomDropdown = ({ options, onSelect, selectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View
      style={{
        marginRight: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={[
          {
            padding: 1,
            borderRadius: 5,
            backgroundColor: isOpen ? "#bfbfbf" : "transparent",
          },
        ]}
        onPress={toggleDropdown}
      >
        <Text>{selectedOption ? selectedOption.value : "defaultLabel"}</Text>
      </TouchableOpacity>
      <View
        style={{
          borderTopWidth: isOpen ? 1 : 0,
          borderColor: "#ccc",
          overflow: "hidden",
        }}
      >
        {isOpen && (
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectOption(item)}>
                <Text style={{ padding: 8, fontSize: 12 }}>{item.value}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value.toString()}
            style={{
              backgroundColor: "#fff",
              maxHeight: 150,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CustomDropdown;
