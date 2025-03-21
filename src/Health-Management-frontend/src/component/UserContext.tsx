import React, { createContext, useState, useContext, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  birthDate?: string;
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  abhaId?: string;
  abhaCardLinked?: boolean;
}

interface UserContextType {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  addProfile: (profile: UserProfile) => void;
  updateProfile: (id: string, profile: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (id: string) => void;
}

const defaultProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Default User',
    email: 'user@example.com',
    avatar: '',
    allergies: [],
    conditions: [],
    medications: []
  }
];

export const UserContext = createContext<UserContextType>({
  profiles: defaultProfiles,
  currentProfile: defaultProfiles[0],
  addProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},
  setCurrentProfile: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const savedProfiles = localStorage.getItem('userProfiles');
    return savedProfiles ? JSON.parse(savedProfiles) : defaultProfiles;
  });
  
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    const savedCurrentProfileId = localStorage.getItem('currentProfileId');
    if (savedCurrentProfileId) {
      const savedProfiles = localStorage.getItem('userProfiles');
      const parsedProfiles = savedProfiles ? JSON.parse(savedProfiles) : defaultProfiles;
      return parsedProfiles.find((p: UserProfile) => p.id === savedCurrentProfileId) || parsedProfiles[0];
    }
    return defaultProfiles[0];
  });

  useEffect(() => {
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('currentProfileId', currentProfile.id);
    }
  }, [currentProfile]);

  const addProfile = (profile: UserProfile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString() // Simple ID generation
    };
    setProfiles([...profiles, newProfile]);
    return newProfile;
  };

  const updateProfile = (id: string, updatedFields: Partial<UserProfile>) => {
    const updatedProfiles = profiles.map(profile => 
      profile.id === id ? { ...profile, ...updatedFields } : profile
    );
    setProfiles(updatedProfiles);
    
    if (currentProfile && currentProfile.id === id) {
      setCurrentProfile({ ...currentProfile, ...updatedFields });
    }
  };

  const deleteProfile = (id: string) => {
    const filteredProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(filteredProfiles);
    
    if (currentProfile && currentProfile.id === id) {
      setCurrentProfile(filteredProfiles[0] || null);
    }
  };

  const switchProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  return (
    <UserContext.Provider
      value={{
        profiles,
        currentProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        setCurrentProfile: switchProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 