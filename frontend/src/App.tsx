import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/features/home/HomePage';
import SpellsPage from '@/features/compendium/SpellsPage';
import SpellDetailPage from '@/features/compendium/SpellDetailPage';
import ClassesPage from '@/features/compendium/ClassesPage';
import ClassDetailPage from '@/features/compendium/ClassDetailPage';
import RacesPage from '@/features/compendium/RacesPage';
import RaceDetailPage from '@/features/compendium/RaceDetailPage';
import MonstersPage from '@/features/compendium/MonstersPage';
import MonsterDetailPage from '@/features/compendium/MonsterDetailPage';
import EquipmentPage from '@/features/compendium/EquipmentPage';
import { CharacterListPage } from '@/features/characters/CharacterListPage';
import { CharacterBuilderPage } from '@/features/characters/CharacterBuilderPage';
import { CharacterDetailPage } from '@/features/characters/CharacterDetailPage';
import HomebrewPage from '@/features/homebrew/HomebrewPage';
import DiceRollerPage from '@/features/dice/DiceRollerPage';
import BooksPage from '@/features/books/BooksPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="spells" element={<SpellsPage />} />
        <Route path="spells/:id" element={<SpellDetailPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="classes/:id" element={<ClassDetailPage />} />
        <Route path="races" element={<RacesPage />} />
        <Route path="races/:id" element={<RaceDetailPage />} />
        <Route path="monsters" element={<MonstersPage />} />
        <Route path="monsters/:id" element={<MonsterDetailPage />} />
        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="characters" element={<CharacterListPage />} />
        <Route path="characters/new" element={<CharacterBuilderPage />} />
        <Route path="characters/:id" element={<CharacterDetailPage />} />
        <Route path="homebrew" element={<HomebrewPage />} />
        <Route path="dice" element={<DiceRollerPage />} />
      </Route>
    </Routes>
  );
}

export default App;
