import { createContext, useState } from 'react';

export const UserContext = createContext({"username": null, "admin": false});