/* Datos del sitio. Fuente unica de verdad (antes data/noticias.json + tools/generar-datos.py). */
window.TNH_DATOS = {
  "sitio": {
    "nombre": "TechNews Hub",
    "descripcion": "La plataforma líder de periodismo de tecnología independiente en español. Datos precisos, análisis profundos.",
    "dominio": "technewshub.com"
  },
  "categorias": [
    {
      "id": "cuantica",
      "nombre": "Computación Cuántica"
    },
    {
      "id": "ia",
      "nombre": "Inteligencia Artificial"
    },
    {
      "id": "hardware",
      "nombre": "Hardware"
    },
    {
      "id": "software",
      "nombre": "Software"
    },
    {
      "id": "seguridad",
      "nombre": "Ciberseguridad"
    },
    {
      "id": "startups",
      "nombre": "Startups"
    },
    {
      "id": "ciencia",
      "nombre": "Ciencia"
    }
  ],
  "autores": [
    {
      "id": "aramos",
      "nombre": "Alejandro Ramos",
      "rol": "Redactor Jefe de Tecnología"
    },
    {
      "id": "mluna",
      "nombre": "Marina Luna",
      "rol": "Editora de Inteligencia Artificial"
    },
    {
      "id": "dpaz",
      "nombre": "Diego Paz",
      "rol": "Corresponsal de Hardware"
    },
    {
      "id": "sfdez",
      "nombre": "Sofía Fernández",
      "rol": "Analista de Ciberseguridad"
    }
  ],
  "noticias": [
    {
      "id": "algoritmos-cuanticos-simulacion-neuronal",
      "titulo": "Algoritmos cuánticos logran la simulación neuronal más compleja hasta la fecha",
      "categoria": "cuantica",
      "autor": "aramos",
      "fecha": "2026-09-29T04:18:00Z",
      "destacada": true,
      "imagen": "img/hero.png",
      "resumen": "Un consorcio internacional de científicos informáticos integró modelos neuronales en hardware cuántico de 128 cubits, procesando información miles de veces más rápido que los superordenadores tradicionales.",
      "cuerpo": [
        "El avance fue anunciado por un equipo conjunto de la Universidad de Delft, el Laboratorio Nacional de Física y dos centros de investigación asiáticos. El sistema opera sobre un procesador de 128 cubits con corrección de errores activa.",
        "La clave está en el algoritmo de mapeo: en lugar de traducir la red neuronal a operadores cuánticos, el equipo descartó el 94% de las interacciones sin efecto medible. Eso reduce la complejidad de forma exponencial.",
        "Tareas de optimización combinatoria que hoy requieren horas de computación clásica se ejecutan en segundos. El siguiente paso declarado es escalar a 512 cubits antes de 2029.",
        "Un grupo independiente de la Universidad de Oxford ya verifica los resultados. En 2019 y 2023 se habían anunciado avances similares que no se pudieron reproducir."
      ]
    },
    {
      "id": "cifrado-cuantico-migracion-2030",
      "titulo": "Advierten que el cifrado cuántico llegará antes de 2030 y obligará a migrar la infraestructura",
      "categoria": "seguridad",
      "autor": "sfdez",
      "fecha": "2026-09-28T16:40:00Z",
      "destacada": true,
      "imagen": "img/noticia-1.png",
      "resumen": "La criptografía del Instituto Nacional de Estándares sostiene que el algoritmo de Shor amenaza hoy con RSA de 2048 bits y que no hay migración viable en el plazo previsto.",
      "cuerpo": [
        "La advertencia llega en el marco de una revisión del plan nacional de transición criptográfica, que por primera vez reconoce un desfase estructural en los cálculos.",
        "El problema no es criptográfico, es de planificación. Migrar el sector bancario público completo lleva 25 años con los recursos actuales. El horizonte disponible es de 10.",
        "El plan propone un despliegue por capas, empezando por firmas de curva elíptica y siguiendo con RSA-2048 en 2033."
      ]
    },
    {
      "id": "nvidia-blackwell-transicion-enterprise",
      "titulo": "La industria enterprise empieza a domar la transición a Blackwell tras la crisis de 2025",
      "categoria": "hardware",
      "autor": "dpaz",
      "fecha": "2026-09-28T09:15:00Z",
      "destacada": true,
      "imagen": "img/noticia-2.png",
      "resumen": "Los tiempos de entrega de los racks GB300 promediaron 14 meses en 2025. Hoy la cadena está reorganizada y la refrigeración líquida ya es estándar en centros de datos de terceros.",
      "cuerpo": [
        "El problema nunca fue la producción de obleas sino la integración del rack. Un sistema Blackwell requiere más potencia que cualquier generación previa, lo que hace obligatoria la refrigeración líquida.",
        "La mejora se atribuye a una estandarización del diseño que permite a terceros ensamblar el rack completo.",
        "El riesgo que persiste es la concentración: una parte creciente de los clústeres de entrenamiento depende de un único proveedor de aceleradores."
      ]
    },
    {
      "id": "modelos-abiertos-licencia-mit",
      "titulo": "Los modelos abiertos con licencia MIT cubren el 70% de los casos de uso enterprise",
      "categoria": "ia",
      "autor": "mluna",
      "fecha": "2026-09-27T14:00:00Z",
      "destacada": false,
      "imagen": "img/noticia-3.png",
      "resumen": "Un informe de 400 empresas europeas encuentra que los equipos eligen modelos abiertos por costo, auditabilidad y cumplimiento normativo, no solo por precio.",
      "cuerpo": [
        "El informe identifica tres motivos dominantes: costo de inferencia, capacidad de auditar el comportamiento del modelo y cumplimiento de residuo de datos. La propiedad intelectual del modelo resulta marginal.",
        "La consecuencia es un desplazamiento de la monetización hacia la capa de orquestación y los datos de contexto, no hacia el modelo en sí."
      ]
    },
    {
      "id": "passkeys-adopcion-empresas",
      "titulo": "La adopción de passkeys en empresas supera el 40% pero tropieza con la recuperación de cuenta",
      "categoria": "seguridad",
      "autor": "sfdez",
      "fecha": "2026-09-26T11:30:00Z",
      "destacada": false,
      "imagen": "img/noticia-4.png",
      "resumen": "El despliegue de passkeys a empleados funciona, pero las ventanas de soporte se llenan de casos de usuarios bloqueados. La industria no resolvió el plano de recuperación.",
      "cuerpo": [
        "El 62% de los departamentos de TI ha desplegado passkeys para clientes, frente al 41% para empleados internos, una brecha que se explica por los casos de soporte.",
        "El fallo de diseño no está en la criptografía sino en el modelo de recuperación. Sin camino de vuelta, la alternativa es un descenso a contraseña que anula el beneficio."
      ]
    },
    {
      "id": "litio-azufre-3700-wh",
      "titulo": "Una batería de litio-azufre de 3.700 Wh/kg entra en producción y redefine el techo energético",
      "categoria": "ciencia",
      "autor": "dpaz",
      "fecha": "2026-09-25T08:20:00Z",
      "destacada": false,
      "imagen": "img/noticia-5.png",
      "resumen": "La densidad medida en prototipos de producción es 2,4 veces la de las celdas NMC actuales. El límite pasa a ser la manufactura, no la química.",
      "cuerpo": [
        "La compañía anuncia la primera línea piloto con capacidad de 40 MWh anuales, suficiente para validar un proceso que hasta ahora solo existía a escala de laboratorio.",
        "El desafío inmediato es la cadena de suministro: el litio y el azufre son abundantes, pero no hay proveedores maduros de electrodo poroso de alta pureza.",
        "En aviación y marina, donde el peso domina el costo, el horizonte es sustancialmente más corto que en automóviles."
      ]
    },
    {
      "id": "finops-ahorro-38-plataforma",
      "titulo": "Equipos de plataforma con FinOps alcanzaron un 38% menos de gasto en nube sin degradar servicio",
      "categoria": "software",
      "autor": "mluna",
      "fecha": "2026-09-24T15:45:00Z",
      "destacada": false,
      "imagen": "img/noticia-6.png",
      "resumen": "El estudio sigue 90 equipos durante 18 meses. La reducción vino de cambios organizativos, no de optimización de máquinas.",
      "cuerpo": [
        "El hallazgo más contraintuitivo: rightsizing y planes de ahorro aportaron menos de un tercio del ahorro total. El resto vino de decisiones de plataforma.",
        "Cuando el equipo puede desplegar en tres regiones en diez minutos, nadie debate si una carga debe correr en cuatro. El costo sube cuando la arquitectura es difícil de cambiar."
      ]
    },
    {
      "id": "observabilidad-consolidacion",
      "titulo": "Las startups de observabilidad son rentables: el mercado se consolida en cinco operadores",
      "categoria": "startups",
      "autor": "aramos",
      "fecha": "2026-09-23T10:00:00Z",
      "destacada": false,
      "imagen": "img/noticia-7.png",
      "resumen": "Después de una década de fragmentación, cinco proveedores capturan el 78% del mercado europeo. El resto sobrevive como nicho vertical.",
      "cuerpo": [
        "La consolidación se aceleró por un cambio de modelo: el cobro por host dejó de funcionar cuando el trabajo se movió a serverless.",
        "Las startups que no llegaron a escala sobreviven en verticales reguladas, donde la auditoría justifica un precio premium."
      ]
    },
    {
      "id": "css-fonts-4-variantes-ligadas",
      "titulo": "El soporte nativo de variantes ligadas tipográficas llega a los navegadores principales",
      "categoria": "software",
      "autor": "mluna",
      "fecha": "2026-09-22T13:20:00Z",
      "destacada": false,
      "imagen": "img/noticia-8.png",
      "resumen": "La especificación CSS Fonts 4 alcanza soporte estable y permite definir grados de peso sin recurrir a hacks de familia y estilo.",
      "cuerpo": [
        "La Until feature permite que una única familia produzca pesos intermedios que el renderizador ajusta según lo solicitado, sin archivos separados.",
        "El impacto inmediato es sobre la carga: un sitio que antes servía cinco archivos de peso 300 a 700 puede servir dos."
      ]
    }
  ],
  "faq": [
    {
      "pregunta": "¿Con qué frecuencia publican artículos nuevos?",
      "respuesta": "Publicamos entre cinco y ocho piezas diarias. La cobertura de eventos de hardware y software se actualiza en tiempo real."
    },
    {
      "pregunta": "¿Puedo reutilizar sus artículos en mi publicación?",
      "respuesta": "Sí, con atribución completa y enlace al original. Para uso comercial solicite licencia en contacto editorial."
    },
    {
      "pregunta": "¿Qué cobertura tienen?",
      "respuesta": "El equipo es distribuido entre Madrid, Ciudad de México y Buenos Aires, con corresponsales en San Francisco y Berlín."
    },
    {
      "pregunta": "¿Ofrecen newsletter o RSS?",
      "respuesta": "La newsletter de los viernes resume lo relevante de la semana. El feed RSS completo está disponible y admite suscripción por categorías."
    },
    {
      "pregunta": "¿Cómo puedo reportar una corrección?",
      "respuesta": "Escribinos desde contacto indicando el titular y el párrafo afectado. Publicamos las correcciones de forma visible al pie del artículo."
    }
  ],
  "metricas": [
    {
      "valor": "250K+",
      "etiqueta": "Lectores Activos Mensuales"
    },
    {
      "valor": "24/7",
      "etiqueta": "Cobertura en Tiempo Real"
    },
    {
      "valor": "100%",
      "etiqueta": "Análisis Independiente"
    }
  ]
};
