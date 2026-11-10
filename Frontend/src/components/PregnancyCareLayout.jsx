
import React from 'react';
import { Outlet } from 'react-router-dom';
import PregnancyAIChatbot from './PregnancyAIChatbot';

export default function PregnancyCareLayout() {
  return (
    <>
      <Outlet />
      <PregnancyAIChatbot />
    </>
  );
}
