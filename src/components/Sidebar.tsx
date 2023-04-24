import React from 'react';
import { AllSkills } from '../utils';
import './Sidebar.css';

type SidebarProps = {
  setChosenViewTarget: (target: AllSkills) => any
}

function Sidebar({ setChosenViewTarget }: SidebarProps) {
  return (
  <nav className='Sidebar'>
    <ul>
      <li onClick={() => setChosenViewTarget(AllSkills.BANKING)}>Bank</li>
      <li onClick={() => setChosenViewTarget(AllSkills.MARKETING)}>Market</li>
    </ul>
    <ul>
      <li onClick={() => setChosenViewTarget(AllSkills.MINING)}>Mining Skill</li>
      <li onClick={() => setChosenViewTarget(AllSkills.SMITHING)}>Smithing Skill</li>
    </ul>
    <ul>
      <li onClick={() => setChosenViewTarget(AllSkills.WOODCUTTING)}>Woodcutting Skill</li>
      <li onClick={() => setChosenViewTarget(AllSkills.WOODWORKING)}>Woodworking Skill</li>
    </ul>
    <ul>
      <li onClick={() => setChosenViewTarget(AllSkills.RUNECRAFTING)}>Runecrafting Skill</li>
      <li onClick={() => setChosenViewTarget(AllSkills.ENCHANTING)}>Enchanting Skill</li>
    </ul>
  </nav>
  )
}

export default Sidebar;
