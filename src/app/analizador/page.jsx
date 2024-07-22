'use client'
import React, { useRef, useEffect, useState } from 'react';
import Indicador from '../indicador/page';

const Analizador = () => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [lineResults, setLineResults] = useState([]);

  //Expresiones para creación
  const inicioEXP = /^/.source;
  const finEXP = /$/.source;
  const cuanMasCADENA = "+";
  const cuanAstCADENA = "*";
  const cuanCorcheteAbreCADENA = "[";
  const cuanCorcheteCierraCADENA = "]";
  const cadenaMinEXP = /a-z/.source;
  const cadenaMayEXP = /A-Z/.source;
  const cadenaNumEXP = /0-9/.source;
  const caracteresEXP = /.-_,:%\+-\[\]/.source;
  const caracteresEsEXP = /.-_,\s:%\+\*\(\)/.source;
  const caracteresCompaEXP = /[\=<>]+/.source;
  const guionEXP = /-_/.source;

  const cadenaMinMayEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cuanCorcheteCierraCADENA + cuanMasCADENA).source;
  const cadenaMinMayNumEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + cuanCorcheteCierraCADENA + cuanMasCADENA).source;
  const cadenaMinMayNumGionEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + guionEXP + cuanCorcheteCierraCADENA + cuanMasCADENA).source;
  const cadenaMinMayNumOpEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + cuanCorcheteCierraCADENA + cuanAstCADENA).source;
  const cadenaMinMayNumCaracEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + caracteresEXP + cuanCorcheteCierraCADENA + cuanMasCADENA).source;
  const cadenaMinMayNumCaracOpEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + caracteresEXP + cuanCorcheteCierraCADENA + cuanAstCADENA).source;
  const cadenaMinMayNumCaracEsEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + caracteresEsEXP + cuanCorcheteCierraCADENA + cuanMasCADENA).source;
  const cadenaMinMayNumCaracEsOpEXP = new RegExp(cuanCorcheteAbreCADENA + cadenaMinEXP + cadenaMayEXP + cadenaNumEXP + caracteresEsEXP + cuanCorcheteCierraCADENA + cuanAstCADENA).source;

  //Expresiones de escape
  const espacioEXP = /[\s]/.source;
  const espacioOpEXP = /[\s]*/.source;
  const tabulacionEXP = new RegExp(espacioEXP + espacioEXP).source;
  const parentesisAbreEXP = /[\(]/.source;
  const parentesisCierraEXP = /[\)]/.source;
  const dosPuntosEXP = /[:]/.source;
  const igualEXP = /[\=]/.source;
  const corcheteAbreEXP = /[\[]/.source;
  const corcheteCierraEXP = /[\]]/.source;
  const corcheteAbreOpEXP = /[\[]*/.source;
  const corcheteCierraOpEXP = /[\]]*/.source;
  const comillaSimpleEXP = /[\']/.source;
  const puntoEXP = /[.]/.source;
  const comaEXP = /[,]/.source;
  const comaOpEXP = /[,]*/.source;
  const masEXP = /\+/.source;

  //Otras expresiones
  const opcionesOpenEXP = /[rawxtb]+/.source;

  //Palabras reservadas
  const defCADENA = "def";
  const tryCADENA = "try";
  const withCADENA = "with";
  const openCADENA = "open";
  const asCADENA = "as";
  const forCADENA = "for";
  const inCADENA = "in";
  const intCADENA = "int";
  const exceptCADENA = "except";
  const printCADENA = "print";
  const returnCADENA = "return";
  const finallyCADENA = "finally";
  const ifCADENA = "if";
  const elseCADENA = "else";
  const breakCADENA = "break";
  const strCADENA = "str";
  const classCADENA = "class";
  const staticCADENA = "@staticmethod";
  const importCADENA = "import";

  //Gramaticas por línea
  const defGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + defCADENA + espacioEXP + cadenaMinMayNumGionEXP
    + parentesisAbreEXP + cadenaMinMayNumCaracEsOpEXP + parentesisCierraEXP + dosPuntosEXP + finEXP);
  const asignacionGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + cadenaMinMayNumCaracEXP + espacioEXP + igualEXP
    + espacioEXP + cadenaMinMayNumCaracEXP + finEXP);
  const tryGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + tryCADENA + dosPuntosEXP + finEXP);
  const withGRAMMAR = new RegExp(withCADENA + espacioEXP + openCADENA + parentesisAbreEXP + comillaSimpleEXP
    + cadenaMinMayNumEXP + puntoEXP + cadenaMinMayEXP + comillaSimpleEXP + comaEXP + espacioEXP + comillaSimpleEXP + opcionesOpenEXP +
    comillaSimpleEXP + parentesisCierraEXP + espacioEXP).source;
  const asGRAMMAR = new RegExp(asCADENA + espacioEXP + cadenaMinMayNumEXP + dosPuntosEXP).source;
  const forGRAMMAR = new RegExp(forCADENA + espacioEXP + cadenaMinMayNumEXP + espacioEXP).source;
  const inGRAMMAR = new RegExp(inCADENA + espacioEXP + cadenaMinMayNumEXP + dosPuntosEXP).source;
  const funcionInternaGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + cadenaMinMayNumCaracOpEXP + parentesisAbreEXP
    + intCADENA + parentesisAbreEXP + cadenaMinMayNumCaracOpEXP + parentesisAbreEXP + parentesisCierraEXP
    + parentesisCierraEXP + parentesisCierraEXP + finEXP);
  const exceptGRAMMAR = new RegExp(exceptCADENA + espacioEXP + cadenaMinMayNumEXP + espacioEXP).source;
  const printGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + printCADENA + parentesisAbreEXP + comillaSimpleEXP + cadenaMinMayNumCaracEsEXP
     + comillaSimpleEXP + cadenaMinMayNumCaracEsOpEXP + parentesisCierraEXP + finEXP);
  const strGRAMMAR = new RegExp(strCADENA + parentesisAbreEXP + cadenaMinMayNumEXP + parentesisCierraEXP).source;
  const printStrGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + printCADENA + parentesisAbreEXP + strGRAMMAR + espacioOpEXP + masEXP 
    + espacioOpEXP + comillaSimpleEXP + cadenaMinMayNumCaracEsEXP + comillaSimpleEXP + cadenaMinMayNumCaracEsOpEXP + 
    parentesisCierraEXP + finEXP);
  const returnGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + returnCADENA + espacioOpEXP + cadenaMinMayNumCaracEsOpEXP + finEXP);
  const finallyGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + finallyCADENA + dosPuntosEXP + finEXP);
  const ifGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + ifCADENA + espacioOpEXP + parentesisAbreEXP + cadenaMinMayNumCaracEXP + espacioOpEXP
    + caracteresCompaEXP + espacioOpEXP + cadenaMinMayNumCaracEXP + parentesisCierraEXP + dosPuntosEXP + finEXP);
  const elseGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + elseCADENA + dosPuntosEXP + finEXP);
  const breakGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + breakCADENA + finEXP);
  const classGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + classCADENA + espacioEXP + cadenaMinMayNumEXP + dosPuntosEXP + finEXP);
  const staticGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + staticCADENA + finEXP);
  const importGRAMMAR = new RegExp(inicioEXP + espacioOpEXP + importCADENA + espacioEXP + cadenaMinMayNumCaracEXP + finEXP);

  //Estructuras del código
  const withSTRUCTURE = new RegExp(inicioEXP + espacioOpEXP + withGRAMMAR + asGRAMMAR + finEXP);
  const forSTRUCTURE = new RegExp(inicioEXP + espacioOpEXP + forGRAMMAR + inGRAMMAR + finEXP);
  const exceptSTRUCTURE = new RegExp(inicioEXP + espacioOpEXP + exceptGRAMMAR + asGRAMMAR + finEXP);

  const reglas = [
    defGRAMMAR,
    asignacionGRAMMAR,
    tryGRAMMAR,
    withSTRUCTURE,
    forSTRUCTURE,
    funcionInternaGRAMMAR,
    exceptSTRUCTURE,
    printGRAMMAR,
    returnGRAMMAR,
    finallyGRAMMAR,
    ifGRAMMAR,
    elseGRAMMAR,
    breakGRAMMAR,
    printStrGRAMMAR,
    classGRAMMAR,
    staticGRAMMAR,
    importGRAMMAR
  ];
  
  const handleInput = (e) => {
    const text = e.target.innerText;
    const lines = text.split('\n');
    const results = lines.map(line => evalLine(line));
    setLineResults(results);
  };

  const evalLine = (line) => {
    for (let exp of reglas) {
      console.log(exp);
      if (exp.test(line)) {
        console.log(line + ' true');
        return true;
      }else{
        console.log(line + ' false');  
      }
    }
    return false;
  };

  useEffect(() => {
    editorRef.current.addEventListener('input', handleInput);
    return () => {
      editorRef.current.removeEventListener('input', handleInput);
    };
  }, []);

  // return (
  //   <div style={{ display: 'flex' }}>
  //     <Indicador results={lineResults} />
  //     <div
  //       key="div-analizador"
  //       ref={editorRef}
  //       contentEditable={true}
  //       style={{
  //         width: '100%',
  //         height: '650px',
  //         fontFamily: 'monospace',
  //         fontSize: '20px',
  //         backgroundColor: '#1F2124',
  //         color: '#FFFFFF',
  //         paddingLeft: '15px',
  //         paddingRight: '30px',
  //         paddingTop: '30px',
  //         paddingBottom: '30px',
  //         overflow: 'auto',
  //         outline: 'none',
  //         whiteSpace: 'pre-wrap',
  //       }}
  //     />
  //   </div>
  // );
  return (
    <div ref={containerRef}
      style={{ display: 'flex', overflow: 'auto', height: '650px'}}>
      <Indicador results={lineResults} />
      <div
        key="div-analizador"
        ref={editorRef}
        contentEditable={true}
        style={{
          width: '100%',
          // height: '650px',
          fontFamily: 'monospace',
          fontSize: '20px',
          backgroundColor: '#1F2124',
          color: '#FFFFFF',
          paddingLeft: '15px',
          paddingRight: '30px',
          paddingTop: '30px',
          paddingBottom: '30px',
          // overflow: 'auto',
          outline: 'none',
          whiteSpace: 'pre-wrap',
        }}
      />
    </div>
  );
};

export default Analizador;