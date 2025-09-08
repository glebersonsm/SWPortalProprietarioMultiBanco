import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export const Step01 = () => (
  <Box>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      CLÁUSULA PRIMERA - OBJETO, DENOMINACIÓN, SEDE CENTRAL DE LA SCP
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="1.1. El objeto de este contrato es la constitución de una empresa no personificada, en cuenta de participación (“SCP”), a ser denominada SCP PRESTIGE y que será gestionada y administrada bajo la responsabilidad de la SOCIA OSTENSIVA." />
      </ListItem>
      <ListItem>
        <ListItemText primary="1.2. La sede central de la SCP estará en la dirección de la SOCIA OSTENSIVA, ubicada en el Municipio de Foz do Iguaçu, Estado de Paraná, en Ruta Carlos Hugo Urnau, 492, Loteamento D Amanda, Código Postal 85.853-734, donde se guardarán todos los libros, documentos y registros sociales." />
      </ListItem>
      <ListItem>
        <ListItemText primary="1.3. De acuerdo con el artículo 991 del Código Civil, la responsabilidad frente a terceros es responsabilidad exclusiva de la SOCIA OSTENSIVA, siendo que los SOCIOS PARTICIPANTES son responsables ante la SOCIA OSTENSIVA única y exclusivamente por los términos de este Contrato." />
      </ListItem>
      <ListItem>
        <ListItemText primary="1.4. El objeto de la SCP son los esfuerzos e intereses conjuntos de las Partes para la realización por parte de la SOCIA OSTENSIVA, en su nombre, de la operación de alquiler de los Períodos de Uso de la Unidad Autónoma que los SÓCIOS PARTICIPANTES tienen derecho y ponen a disposición del Centro de Alquiler de la SOCIA OSTENSIVA." />
      </ListItem>
    </List>

    {/* CLÁUSULA SEGUNDA */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      CLÁUSULA SEGUNDA - FONDO SOCIAL
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="2.1. Las Partes acuerdan que las inversiones y la disponibilidad de activos y derechos a la SCP tienen la finalidad de arrendamiento, para la SOCIA OSTENSIVA, de los Períodos de Uso de la Unidad Autónoma de los SOCIOS PARTICIPANTES puesto a disposición del Centro de Alquiler de la SOCIA OSTENSIVA, de acuerdo con las disposiciones contenidas en el Contrato de Concesión, las “Normas y Políticas de Uso”, la “Convención del Condominio Prestige” y el “Reglamento Interno del Condominio Prestige”. De acuerdo con este Acuerdo y de acuerdo con la legislación vigente, las Partes acuerdan que su contribución al Fondo Social de la SCP será como sigue:" />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="(a) la SOCIA OSTENSIVA aportará su labor de gestión, know-how, competencia profesional, activos necesarios para el cumplimiento del objeto social en los estrictos términos señalados en este Contrato;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="(b) los SOCIOS PARTICIPANTES cederán los derechos de uso y goce de su respectivo Periodo de Uso de las Unidades Autónomas, puestos a disposición del Centro de Alquiler de la SOCIA OSTENSIVA, observando las disposiciones del Contrato de Concesión." />
        </ListItem>
      </List>
      <ListItem>
        <ListItemText primary="2.2. Las Partes acuerdan que se asignará 1 (una) cuota a la SOCIA OSTENSIVA y 1 (una) cuota a cada SOCIO PARTICIPANTE, cada acción tiene un valor nominal de R$ 1,00 (un real), debiendo observarse las disposiciones de la Cláusula Octava a continuación para efectos de cálculo y distribución de dividendos." />
      </ListItem>
      <ListItem>
        <ListItemText primary="2.3. Las Participaciones de los Socios en el fondo social no podrán ser ofrecidas en prenda, depósito de garantía, enajenación fiduciaria o cualquier otra forma de garantía, ni siquiera en usufructo o fideicomiso sin la aprobación previa y expresa, por escrito, del otro socio, bajo pena de nulidad ante la SCP, socios y terceros." />
      </ListItem>
    </List>

    {/* CLÁUSULA TERCERA */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      CLÁUSULA TERCERA – VIGENCIA
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="3.1. El presente contrato entra en vigencia en la fecha de su firma y tendrá vigencia para cada una de los SOCIOS PARTICIPANTES por el mismo plazo del respectivo Contrato de Concesión. Las Partes acuerdan que, en cualquier caso de terminación del Contrato de Concesión, la presente SCP será automáticamente rescindido en relación con ese SOCIO PARTICIPANTE cuyo Contrato de Concesión fue rescindido, permaneciendo vigente y sin cambios en relación con los demás socios." />
      </ListItem>
    </List>

    {/* CLÁUSULA CUARTA */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      CLÁUSULA CUARTA – ADMINISTRACIÓN DE LA SCP
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="4.1. La administración de los asuntos sociales de la SCP será responsabilidad única y exclusiva de la SOCIA OSTENSIVA, quien será responsable de practicar los actos de administración siempre y exclusivamente de acuerdo con el objeto de la SCP. Por lo tanto, la SOCIA OSTENSIVA será responsable de llevar a cabo todo el control contable, financiero y fiscal de la SCP, en contabilidad propia, observando los principios contables generalmente aceptados y las normas contables y fiscales inherentes al cálculo de resultados en la actividad inmobiliaria." />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="4.1.1. La SOCIA OSTENSIVA realizará los actos previstos en este Contrato siempre en su nombre y responsabilidad, siendo el único responsable ante terceros." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4.1.2. La SOCIA OSTENSIVA representará la SCP en todos los actos comerciales y legales, con las oficinas de los gobiernos municipal, estatal, federal y local, activa y pasivamente, judicial y extrajudicialmente." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4.1.3. Sin perjuicio del derecho a supervisar la gestión del negocio de la SOCIA OSTENSIVA, los SOCIOS PARTICIPANTES no participarán en las relaciones de la SOCIA OSTENSIVA con terceros, según lo determina el párrafo único, del artículo 993, del Código Civil, por lo que este Contrato sólo entra en vigor entre los Socios." />
        </ListItem>
      </List>
    </List>

    {/* CLÁUSULA QUINTA */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      CLÁUSULA QUINTA – DERECHOS Y OBRIGACIONES DE LOS SOCIOS
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="5.1. Constituyen obligaciones de la SOCIA OSTENSIVA:" />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        {[
          "a) Desarrollar las actividades sociales de la SCP en los estrictos términos de la legislación vigente y aplicable, principalmente, a título enunciativo pero no limitativo, en lo que se refiere a licencias, registros, certificados y cualesquiera otros documentos necesarios para el desarrollo regular de las actividades;",
          "b) Respetar y hacer cumplir estrictamente todas las leyes, ordenanzas y determinaciones de las autoridades públicas competentes, en todo lo que concierna a las actividades de la SCP;",
          "c) Respetar y hacer cumplir estrictamente las disposiciones del Contrato de Concesión;",
          "d) Realizar el control de los resultados financieros de las actividades de la SCP;",
          "e) Procesar y llevar la contabilidad, en sus propios libros, de acuerdo con las reglas de contabilidad comercial y con los principios contables generalmente aceptados por el sistema brasileño, de todo el movimiento de ingresos y gastos relacionados con la operación de la SCP;",
          "f) Realizar la recogida de los impuestos que resulten de las actividades de la SCP y cumplir con todas las obligaciones tributarias accesorias;",
          "g) Revelar, cuando se le solicite, todas las informaciones de la SCP a los SOCIOS PARTICIPANTES sobre todos los hechos o actos relevantes que no estén expresamente determinados en este Contrato;",
          "h) Distribuir las ganancias o prorratear las pérdidas de la SCP;",
          "i) Recibir cualquier monto o ingreso de la SCP;",
          "j) Mantenerse actualizado y en perfecta orden:",
        ].map((text, i) => (
          <ListItem key={i}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <List component="div" disablePadding sx={{ pl: 4 }}>
          {[
            "i) El registro de socios;",
            "ii) El libro de actas de las reuniones de los socios;",
            "iii) El libro de asistencia a la reunión;",
            "iv) El archivo de dictámenes e informes técnicos, incluidos los de los auditores;",
            "v) Los registros contables referentes a las actividades y operaciones de la SCP;",
            "vi) La documentación relacionada con las operaciones de la SCP.",
          ].map((text, i) => (
            <ListItem key={`j-${i}`}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <ListItem>
          <ListItemText primary="k) En los casos de disolución de la SCP, por cualquier motivo, presentar la rendición de cuentas actualizada." />
        </ListItem>
      </List>

      <ListItem>
        <ListItemText primary="5.2. Es el deber de la SOCIA OSTENSIVA actuar en la administración social con el cuidado y la diligencia que todo hombre activo y íntegro suele emplear en su propio negocio." />
      </ListItem>

      <ListItem>
        <ListItemText primary="5.3. También dependerá de la SOCIA OSTENSIVA el deber de respetar los límites de los objetivos sociales, manteniendo su desempeño dentro de las previsiones aquí establecidas, y en ningún caso podrá hacer uso del patrimonio social de la SCP para garantizar deudas distintas de las relacionadas con el desarrollo de las actividades sociales de la SCP." />
      </ListItem>

      <ListItem>
        <ListItemText primary="5.4. La SOCIA OSTENSIVA se compromete a llevar los registros contables de todas y cada una de las operaciones del SCP de forma segregada o en sus propios libros, a opción de la SOCIA OSTENSIVA, garantizando a los SOCIOS PARTICIPANTES acceso irrestricto a dichos registros, previa solicitud." />
      </ListItem>

      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="5.4.1. Los registros contables de la SCP se harán por escrito, de acuerdo con los principios contables generalmente aceptados en Brasil, y se mantendrán en forma adecuada, actualizada, precisa y suficiente." />
        </ListItem>
        <ListItem>
          <ListItemText primary="5.4.2. La SOCIA OSTENSIVA será responsable de presentar las declaraciones de impuestos sobre la renta de la empresa SCP, así como del pago de cualquier impuesto, contribución o tasa adeudada." />
        </ListItem>
        <ListItem>
          <ListItemText primary="5.4.3. Al final del año fiscal, el balance patrimonial, así como los demás estados financieros relevantes, serán preparados por la SOCIA OSTENSIVA, quien remitirá copia para información de los SOCIOS PARTICIPANTES." />
        </ListItem>
      </List>

      <ListItem>
        <ListItemText primary="5.5. Son derechos de la SOCIA OSTENSIVA:" />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="a) Recibir la participación en las utilidades de la SCP en un monto a determinar equivalente al 20% sobre los ingresos brutos de la SCP;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="b) Ser reembolsada por todas las cantidades en las que se haya incurrido a favor de la SCP." />
        </ListItem>
      </List>

      <ListItem>
        <ListItemText primary="5.6. Son derechos de los SOCIOS PARTICIPANTES:" />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="a) Solicitar y obtener aclaraciones y rendición de cuentas relacionadas con las actividades de la SCP;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="b) Supervisar las actividades de la SOCIA OSTENSIVA, exigiendo el cumplimiento de todos sus deberes y obligaciones;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="c) Ocupar la(s) Unidad(es) Autónoma(s) de las cuales son cesionarios, conforme el “Contrato Real de Concesión del Derecho de Uso” y las “Normas y Políticas de Uso”;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="d) Recibir el resultado del alquiler por su(s) Unidad(es) Autónoma(s) conforme lo estipulado en este contrato." />
        </ListItem>
      </List>

      <ListItem>
        <ListItemText primary="5.7. Son obligaciones de los SOCIOS PARTICIPANTES:" />
      </ListItem>
      <List component="div" disablePadding sx={{ pl: 4 }}>
        <ListItem>
          <ListItemText primary="a) Ceder a la SOCIA OSTENSIVA, con el fin de lograr el objeto social de la SCP, la posesión y uso de la(s) Unidad(es) Autónoma(s) en los términos de este contrato y los “Términos y Condiciones del Centro de Alquiler”;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="b) Garantizar la posesión y uso pacífico de la(s) Unidad(es) Autónoma(s) y áreas comunes del Condominio Prestige a la SOCIA OSTENSIVA;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="c) Aceptar la suspensión del derecho a recibir cualquier monto si estuviera en mora, autorizando a la SOCIA OSTENSIVA a retener y compensar valores;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="d) No realizar ningún acto que afecte negativamente la actividad y funcionamiento de la SCP." />
        </ListItem>
      </List>
    </List>

    {/* CLÁUSULA SEXTA */}
    <Box mb={4}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        CLÁUSULA SEXTA – ASAMBLEA GENERALES
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="6.1. Los socios se reunirán en Asamblea General, Ordinaria o Extraordinaria, a fin de deliberar de manera conjunta sobre los asuntos que puedan ser necesarios como consecuencia de este Contrato." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.2. Las Asambleas Generales serán convocadas por la SOCIA OSTENSIVO, o en casos excepcionales por los SOCIO(S) PARTICIPANTE(S) directamente, siempre que dicha citación se haga al menos 1/5 (una quinta parte) del total SÓCIO(S) PARTICIPANTE(S)." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.3. Las Asambleas Generales se llevará a cabo en la oficina central de la SCP o, excepcionalmente, en otro lugar indicado por la SOCIA OSTENSIVA, con la respectiva justificación." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.4. La convocatoria indicará el resumen del orden del día, la fecha, la hora de la primera y segunda convocatorias y la ubicación de la Asamblea, y será firmada por quienes las convoquen. Las convocatorias a las Asambleas Generales Ordinarias irán acompañadas de copia del Balance Anual y/u otros documentos que la SOCIA OSTENSIVA quiere ser aprobado. Cualquier asunto que no esté expresamente indicado en el orden del día podrá ser objeto de deliberación en la Asamblea." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.5. Entre la fecha de la convocatoria y la fecha de la Junta General, debe haber un plazo de 08 (ocho) días, como mínimo, por correspondencia enviada por carta certificada o por aviso publicado en un periódico de la región donde se encuentra la SCP." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.6. Las Asambleas Generales Extraordinarias podrán ser convocadas especialmente con plazos de 05 (cinco) días, cuando se compruebe la urgencia." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.7. Es lícito, en la misma convocatoria, fijar el horario de celebración de la Asamblea en primera y segunda convocatoria, con un intervalo entre ellas de al menos 30 (treinta) minutos." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.8. Las Asambleas Generales estarán presididas por un representante de la SOCIA OSTENSIVA y la secretaría por el representante de los SOCIOS PARTICIPANTES." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.9. Las Asambleas Generales Ordinarias y Extraordinarias se celebrarán, en la primera convocatoria, con la presencia de socios representantes de 2/3 (dos tercios) del Fondo Social y, en la segunda, con cualquier número, respetando, en todo caso, la validez de las decisiones tomadas, el quórum mínimo estipulado por la ley y por este instrumento." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.10. Cualquier deliberación social será aprobada por mayoría simple de los Socios." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.11. No podrán votar en las Asambleas los SOCIOS PARTICIPANTES que estén morosos ante la SCP." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.12. Los SOCIOS PARTICIPANTES podrán emitir su voto mediante Declaración de Voto por escrito, la cual deberá ser remitida a la SOCIA OSTENSIVA por carta o telegrama con acuse de recibo, o mediante protocolo, o incluso por fax o correo electrónico." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.13. Solo se admitirán las declaraciones de voto recibidas antes del inicio de las deliberaciones." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.14. Es lícito a los SOCIOS PARTICIPANTES estar representado en las Asambleas Generales por un apoderado con poderes especiales, propios de dicha ceremonia. Un solo apoderado puede ser titular de varios poderes (poder) y, por tanto, de esta forma, representar a varios SOCIOS PARTICIPANTES." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.15. El poder que se exhibirá al Presidente de la Asamblea, ya sea público o privado, deberá estar fechado y firmado por el otorgante, con firma notarial y además incluir la plena calificación del apoderado designado." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.16. La Asamblea General de Socios se reunirá en carácter ordinario anualmente, hasta finales de marzo, para la aprobación y/o ratificación de los estados de resultados operativos de la SCP referido al Ejercicio Fiscal anterior." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.17. Otras Asambleas Generales podrán ser convocadas extraordinariamente, siempre cuando sea necesario." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="6.18. Las decisiones de las Asambleas Ordinarias o Extraordinarias de Accionistas, con excepción de los quórums específicos previstos en este instrumento, se tomarán por mayoría de votos válidos presentes, obligando a la totalidad de los SÓCIOS PARTICIPANTES, incluidos los que no asistieron y los disidentes." />
        </ListItem>
      </List>
    </Box>

    {/* CLÁUSULA SÉPTIMA */}
    <Box mb={4}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        CLÁUSULA SÉPTIMA – PRESENTACIÓN DE LAS CUENTAS
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="7.1. La SOCIA OSTENSIVA se someterá a la aprobación de los SOCIOS PARTICIPANTES el cierre de las cuentas del Ejercicio del Año Fiscal pasado, dentro del plazo indicado en este Contrato." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="7.2. Aprobado el Saldo Anual por los SOCIOS PARTICIPANTES, dicho documento no podrá ser objeto de futuras preguntas, salvo hipótesis de error o fraude." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="7.3. El Saldo Anual será certificado como verdadero, correcto y completo por la SOCIA OSTENSIVA e identificará las discrepancias entre el mismo y los balances mensuales." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="7.4. El Balance Anual contendrá una comparación con el Ejercicio Fiscal del Año Fiscal anterior, todo de acuerdo con los principios contables." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="7.5. Siempre que haya dudas o desaprobación de cualquier elemento del Saldo anual, los SOCIOS PARTICIPANTES deberán hacerlo señalando claramente su discordia, bajo pena de que el Saldo Anual se considere aprobado." />
        </ListItem>
      </List>
    </Box>

    {/* CLÁUSULA OCTAVA */}
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        CLÁUSULA OCTAVA – APURACIÓN Y DISTRIBUCIÓN DE RESULTADOS
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="8.1. Los SOCIOS (ostensivo y participantes) tienen derecho a recibir su participación en la distribución de dividendos de la SCP se determinará de conformidad con los términos del punto 2 y los subpuntos del anexo II." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="8.2. Los dividendos obtenidos anualmente, tendrán la aplicación que determine la Asamblea, que antes de deliberar recibirá un dictamen rector de la SOCIA OSTENSIVA, garantizada a todos los socios su participación proporcional." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="8.3. El pago de dividendos se realizará previa deducción de los impuestos que les sean aplicables y que corresponda a la SOCIA OSTENSIVA retener." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="8.4. La participación de cada SOCIO(S) PARTICIPANTE(S) será definitivamente calculado y pagado anualmente, no obstante, podrá ser objeto de anticipos mensuales, siempre que, por recomendación de la SOCIA OSTENSIVA con base en su experiencia profesional, la situación económica y de caja de la Sociedad así lo permite, observando los Términos donde se especifique sobre la distribución de resultados, adjuntos a este instrumento." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="8.5. Se establece que la utilidad neta relacionada con el cálculo de los resultados que se produzcan mensualmente, se distribuirá proporcionalmente a cada SOCIO(S) PARTICIPANTE(S), según el número de Periodos de Uso puestos a disposición en ese periodo e incluidos en el cálculo, así como según el tipo de estación del Periodo de Uso." />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="8.6. La SOCIA OSTENSIVA estará disponible mensualmente para los SOCIOS PARTICIPANTES los estados de resultados netos del período." />
        </ListItem>
      </List>
    </Box>
  </Box>
);
