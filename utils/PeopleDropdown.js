// PeopleDropdown.js

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PeopleDropdown = ({ options, onUpdate, peopleCounts }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Initialize state object dynamically based on options
  const initialState = options.reduce((acc, option) => {
    acc[option] = 0; // Initialize each state variable to 0
    return acc;
  }, {});

  // Use the state object and setState function
  const [counts, setCounts] = useState(initialState);

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Debounce the onUpdate function to stop it from causing error due to
  // onUpdate function passed from the FlightScreen component to the PeopleDropdown component
  // to re-render too many times or too quickly
  const debouncedUpdate = debounce(onUpdate, 500); //  delay re-renders by by 500 milliseconds

  // Function to handle incrementing count for an option
  const handleIncrement = (option) => {
    setCounts((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [option]: prevCounts[option] + 1,
      };
      const totalCount = Object.values(updatedCounts).reduce(
        (total, count) => total + count,
        0
      );

      if (totalCount <= 9) {
        debouncedUpdate(updatedCounts); // Call the debounced onUpdate

        return updatedCounts;
      } else {
        // If the total count exceeds 9, don't update the counts
        return prevCounts;
      }
    });
  };

  // Function to handle decrementing count for an option
  const handleDecrement = (option) => {
    if (counts[option] > 0) {
      setCounts((prevCounts) => {
        const updatedCounts = {
          ...prevCounts,
          [option]: prevCounts[option] - 1,
        };
        // onUpdate(updatedCounts); // Call onUpdate with updated counts
        debouncedUpdate(updatedCounts); // Call the debounced onUpdate

        return updatedCounts;
      });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={[
          styles.dropdownButton,
          {
            padding: 5,
            borderRadius: 5,
            backgroundColor: isOpen ? "#bfbfbf" : "transparent",
          },
        ]}
      >
        <Text>People</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={{ backgroundColor: "#fff" }}>
          {options.map((option) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              key={option}
            >
              <Text style={{ fontSize: 12 }}>{option}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => handleDecrement(option)}>
                  <Text style={{ padding: 8, fontSize: 12 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ padding: 8 }}>{counts[option]}</Text>
                <TouchableOpacity onPress={() => handleIncrement(option)}>
                  <Text style={{ padding: 8, fontSize: 12 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  countControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlText: {
    padding: 8,
    fontSize: 20,
  },
  count: {
    padding: 8,
  },
});

export default PeopleDropdown;
