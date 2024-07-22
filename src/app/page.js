import Analizador from "./analizador/page";

export default function Home() {
  return (
    <div
      key="div-page"
      style={{
        fontFamily: 'monospace',
        backgroundColor: '#1F2124',
        padding: '30px',
        width: '100%',
        // height: '100%',  
        minHeight: '100vh',
      }}>
      <h1 style={{fontSize: '40px'}}>Sibimi Tixt</h1>
      <Analizador/>
    </div>
  );
}