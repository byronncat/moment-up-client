"use client";

import {
  type Contact,
  mockContacts,
  mockUserStatuses,
  type UserStatus,
} from "@/__mocks__";
import { createContext, useContext, useState } from "react";

const ContactContext = createContext(
  {} as {
    contacts: Contact[];
    setContacts: (contacts: Contact[]) => void;
    currentContactId: string | null;
    setCurrentContactId: (currentContactId: string | null) => void;
    userStatuses: UserStatus[];
  }
);

export const useContact = () => useContext(ContactContext);

export default function ContactProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [currentContactId, setCurrentContactId] = useState<string | null>(
    mockContacts[0].id || null
  );

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>(
    mockUserStatuses || []
  );

  return (
    <ContactContext.Provider
      value={{
        contacts,
        setContacts,
        currentContactId,
        setCurrentContactId,
        userStatuses,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
