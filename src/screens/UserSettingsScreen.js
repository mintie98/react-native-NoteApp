import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { Switch, Button, Card, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BASE_URL } from '@env';
import {jwtDecode} from 'jwt-decode';

const UserSettingsScreen = ({ updateSettings, navigation, styles: customStyles }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontStyle, setFontStyle] = useState('normal');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        const size = await AsyncStorage.getItem('fontSize');
        const style = await AsyncStorage.getItem('fontStyle');
        setIsDarkTheme(theme === 'dark');
        setFontSize(size || 'medium');
        setFontStyle(style || 'normal');
        
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUserName(decoded.username);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error loading settings or decoding token:', error);
      }
    };
    loadSettings();
  }, []);

  const saveSettingsToStorage = async () => {
    try {
      await AsyncStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('fontSize', fontSize);
      await AsyncStorage.setItem('fontStyle', fontStyle);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSaveSettings = () => {
    saveSettingsToStorage();
    updateSettings({
      theme: isDarkTheme ? 'dark' : 'light',
      fontSize,
      fontStyle,
    });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      await axios.post(`${BASE_URL}/auth/changePassword`, {
        userId,
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: token },
      });
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, customStyles, { backgroundColor: theme.colors.background }]}>
        <Card style={[styles.card, customStyles]}>
          <Card.Title icon="cog" title="User Settings" titleStyle={[customStyles, { color: theme.colors.text }]} />
          <Card.Content>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, customStyles, { color: theme.colors.text }]}>Account Settings</Text>
              <View style={styles.setting}>
                <Text style={[styles.text, customStyles, { color: theme.colors.text }]}>Change Password</Text>
              </View>
              <TextInput
                label="Current Password" 
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={[styles.input, customStyles]}
                theme={{ colors: { text: theme.colors.text, background: theme.colors.surface } }}
              />
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={[styles.input, customStyles]}
                theme={{ colors: { text: theme.colors.text, background: theme.colors.surface } }}
              />
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={[styles.input, customStyles]}
                theme={{ colors: { text: theme.colors.text, background: theme.colors.surface } }}
              />
              <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                Change Password
              </Button>
              <Button mode="contained" onPress={handleLogout} style={styles.button}>
                Logout
              </Button>
            </View>
            <View style={styles.underline} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, customStyles, { color: theme.colors.text }]}>Theme Settings</Text>
              <View style={styles.setting}>
                <Text style={[styles.text, customStyles, { color: theme.colors.text }]}>Dark Theme</Text>
                <Switch
                  value={isDarkTheme}
                  onValueChange={setIsDarkTheme}
                  style={styles.switch}
                />
              </View>
              <View style={styles.setting}>
                <Text style={[styles.text, customStyles, { color: theme.colors.text }]}>Font Size</Text>
                <SegmentedControl
                  values={['Small', 'Medium', 'Large']}
                  selectedIndex={fontSize === 'small' ? 0 : fontSize === 'large' ? 2 : 1}
                  onChange={(event) => {
                    const value = event.nativeEvent.value.toLowerCase();
                    setFontSize(value);
                  }}
                  style={styles.segmentedControl}
                />
              </View>
              <View style={styles.setting}>
                <Text style={[styles.text, customStyles, { color: theme.colors.text }]}>Font Style</Text>
                <SegmentedControl
                  values={['Normal', 'Italic', 'Bold']}
                  selectedIndex={fontStyle === 'italic' ? 1 : fontStyle === 'bold' ? 2 : 0}
                  onChange={(event) => {
                    const value = event.nativeEvent.value.toLowerCase();
                    setFontStyle(value);
                  }}
                  style={styles.segmentedControl}
                />
              </View>
            </View>
            <View style={styles.underline} />
            <Button mode="contained" onPress={handleSaveSettings} style={styles.button}>
              Save Settings
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginLeft: 16,
  },
  segmentedControl: {
    flex: 1,
    marginLeft: 16,
  },
  switch: {
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  underline: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});

export default UserSettingsScreen;