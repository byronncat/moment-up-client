"use client";

import { mockContacts, mockUserStatuses } from "@/__mocks__";
import type { ContactDto, UserStatusDto } from "api";

import { createContext, useContext, useState } from "react";

type ContactContextType = {
  contacts: ContactDto[];
  currentContactId: string | null;
  userStatuses: UserStatusDto[];
  setContacts: (contacts: ContactDto[]) => void;
  setCurrentContactId: (currentContactId: string | null) => void;
};

const ContactContext = createContext<ContactContextType>({
  contacts: [],
  currentContactId: null,
  userStatuses: [],
  setContacts: () => {},
  setCurrentContactId: () => {},
});

export const useContact = () => useContext(ContactContext);

export default function ContactProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contacts, setContacts] = useState<ContactDto[]>(mockContacts);
  const [currentContactId, setCurrentContactId] = useState<string | null>(
    mockContacts[0].id || null
  );

  const [userStatuses] = useState<UserStatusDto[]>(mockUserStatuses || []);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        currentContactId,
        userStatuses,
        setContacts,
        setCurrentContactId,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
