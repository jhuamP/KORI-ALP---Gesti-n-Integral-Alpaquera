import React from 'react';
import styles from './Inventario.module.css';

const myAlpacas = [
  { id: 'ALP-010', name: 'Inti', breed: 'Huacaya', age: '3 años', micron: '19.5µ', grade: 'Baby Alpaca', status: 'Activo', image: 'https://images.unsplash.com/photo-1542152862-243e8bb8ea07?q=80&w=600&auto=format&fit=crop' },
  { id: 'ALP-011', name: 'Pukara', breed: 'Suri', age: '2 años', micron: '21.0µ', grade: 'Fleece', status: 'Activo', image: 'https://images.unsplash.com/photo-1596781285272-9720562e316a?q=80&w=600&auto=format&fit=crop' },
  { id: 'ALP-012', name: 'Qori', breed: 'Huacaya', age: '4 años', micron: '23.5µ', grade: 'Huarizo', status: 'Gestación', image: 'https://images.unsplash.com/photo-1563290372-9cc7277e3848?q=80&w=600&auto=format&fit=crop' },
  { id: 'ALP-013', name: 'Chaska', breed: 'Suri', age: '1 año', micron: '18.2µ', grade: 'Royal Alpaca', status: 'Activo', image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cb1669?q=80&w=600&auto=format&fit=crop' },
];

/* Iconos SVG inline — reemplaza el import roto de lucide-react */
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FilterIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

export default function Inventario() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventario de Lotes</h1>
          <p className={styles.subtitle}>Gestión genética y control de calidad de fibra.</p>
        </div>
        <button className={styles.primaryBtn}>
          <PlusIcon /> Nueva Alpaca
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input type="text" placeholder="Buscar por arete o nombre..." className={styles.searchInput} />
        </div>
        <button className={styles.filterBtn}>
          <FilterIcon /> Filtrar
        </button>
      </div>

      <div className={styles.grid}>
        {myAlpacas.map(alpaca => (
          <div key={alpaca.id} className={styles.card}>
            <div className={styles.cardImageWrapper}>
              <img src={alpaca.image} alt={alpaca.name} className={styles.cardImage} />
              <div className={styles.statusBadge} data-status={alpaca.status}>{alpaca.status}</div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3>{alpaca.name}</h3>
                <span className={styles.tagId}>{alpaca.id}</span>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <span>Raza</span>
                  <strong>{alpaca.breed}</strong>
                </div>
                <div className={styles.stat}>
                  <span>Edad</span>
                  <strong>{alpaca.age}</strong>
                </div>
                <div className={styles.stat}>
                  <span>Calidad</span>
                  <strong className={styles.highlight}>{alpaca.micron}</strong>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.gradeBadge}>{alpaca.grade}</span>
                <button className={styles.actionBtn}>Ver Ficha</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
