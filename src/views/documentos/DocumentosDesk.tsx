import { FileSearch, FolderOpen, Search, Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/base/Button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/base/Empty";
import { Input } from "@/components/base/Input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/base/Sheet";
import { Skeleton } from "@/components/base/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/base/Tabs";
import { toast } from "@/components/base/Toaster";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  cargarClientes,
  cargarDocumentos,
  type Cliente,
  type Documento,
  guardarResumen,
  marcarNoSirve,
  marcarSirve,
  subirDocumentos,
} from "@/services/documentos";

import { CarpetasClientes, TODOS } from "./CarpetasClientes";
import { DocumentoPanel } from "./DocumentoPanel";
import { DocumentosTabla } from "./DocumentosTabla";
import { type FiltroEstado, FILTROS, TIPO_LABEL } from "./labels";
import { SubirDocumentosDialog } from "./SubirDocumentosDialog";

type Carga = "cargando" | "error" | "listo";

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function DocumentosDesk() {
  const [carga, setCarga] = React.useState<Carga>("cargando");
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [documentos, setDocumentos] = React.useState<Documento[]>([]);
  const [clienteSel, setClienteSel] = React.useState<string>(TODOS);
  const [filtro, setFiltro] = React.useState<FiltroEstado>("porRevisar");
  const [busqueda, setBusqueda] = React.useState("");
  const [abiertoId, setAbiertoId] = React.useState<string>();
  const panelFijo = useMediaQuery("(min-width: 1280px)");

  const recargarDocumentos = React.useCallback(async () => {
    setDocumentos(await cargarDocumentos());
  }, []);

  const [intentoCarga, setIntentoCarga] = React.useState(0);
  const cargarTodo = () => {
    setCarga("cargando");
    setIntentoCarga((n) => n + 1);
  };

  React.useEffect(() => {
    let vigente = true;
    Promise.all([cargarClientes(), cargarDocumentos()])
      .then(([c, d]) => {
        if (!vigente) return;
        setClientes(c);
        setDocumentos(d);
        setCarga("listo");
      })
      .catch(() => vigente && setCarga("error"));
    return () => {
      vigente = false;
    };
  }, [intentoCarga]);

  const clientesPorId = React.useMemo(
    () => Object.fromEntries(clientes.map((c) => [c.id, c])),
    [clientes],
  );

  const { totales, porRevisar } = React.useMemo(() => {
    const t: Record<string, number> = {};
    const p: Record<string, number> = {};
    for (const d of documentos) {
      t[d.clienteId] = (t[d.clienteId] ?? 0) + 1;
      if (d.estadoRevision === "porRevisar") p[d.clienteId] = (p[d.clienteId] ?? 0) + 1;
    }
    return { totales: t, porRevisar: p };
  }, [documentos]);

  const deCarpeta = React.useMemo(
    () => documentos.filter((d) => clienteSel === TODOS || d.clienteId === clienteSel),
    [documentos, clienteSel],
  );

  const conteoFiltro = (f: FiltroEstado) =>
    f === "todos"
      ? deCarpeta.length
      : f === "porRevisar"
        ? deCarpeta.filter((d) => d.estadoRevision === "porRevisar" || d.estadoRevision === "procesando").length
        : deCarpeta.filter((d) => d.estadoRevision === f).length;

  const visibles = React.useMemo(() => {
    const q = normalizar(busqueda.trim());
    return deCarpeta
      .filter((d) =>
        filtro === "todos"
          ? true
          : filtro === "porRevisar"
            ? d.estadoRevision === "porRevisar" || d.estadoRevision === "procesando"
            : d.estadoRevision === filtro,
      )
      .filter((d) => {
        if (!q) return true;
        const c = clientesPorId[d.clienteId];
        return [d.nombre, TIPO_LABEL[d.tipoDocumento], c?.nombre ?? "", c?.rut ?? ""].some((v) =>
          normalizar(v).includes(q),
        );
      })
      .sort((a, b) => b.subidoEn.localeCompare(a.subidoEn));
  }, [deCarpeta, filtro, busqueda, clientesPorId]);

  const abierto = documentos.find((d) => d.id === abiertoId);
  const clienteActual = clienteSel === TODOS ? undefined : clientesPorId[clienteSel];
  const totalPendientes = Object.values(porRevisar).reduce((a, b) => a + b, 0);

  // ── Acciones ──────────────────────────────────────────────
  const onSubir = async (clienteId: string, archivos: File[]) => {
    try {
      await subirDocumentos(clienteId, archivos, () => {
        void recargarDocumentos();
        toast.success(archivos.length > 1 ? "Resúmenes listos" : "Resumen listo", {
          description: "Los documentos quedaron por revisar.",
        });
      });
      await recargarDocumentos();
      setClienteSel(clienteId);
      setFiltro("porRevisar");
      setBusqueda("");
      toast.success(
        archivos.length > 1 ? `${archivos.length} documentos subidos` : "Documento subido",
        { description: `Carpeta de ${clientesPorId[clienteId]?.nombre}. El resumen estará listo en unos segundos.` },
      );
    } catch {
      toast.error("No pudimos subir los documentos. Intenta de nuevo.");
    }
  };

  /** Tras decidir, abre el siguiente pendiente de la lista para seguir revisando. */
  const abrirSiguientePendiente = (despuesDe: string) => {
    const pendientes = visibles.filter((d) => d.estadoRevision === "porRevisar" && d.id !== despuesDe);
    setAbiertoId(pendientes[0]?.id ?? despuesDe);
  };

  const onSirve = async (id: string) => {
    const eraPendiente = documentos.find((d) => d.id === id)?.estadoRevision === "porRevisar";
    try {
      await marcarSirve(id);
      await recargarDocumentos();
      toast.success("Marcado como sirve");
      if (eraPendiente) abrirSiguientePendiente(id);
    } catch {
      toast.error("No pudimos guardar la decisión. Intenta de nuevo.");
    }
  };

  const onNoSirve = async (
    id: string,
    datos: Parameters<typeof marcarNoSirve>[1],
  ) => {
    const eraPendiente = documentos.find((d) => d.id === id)?.estadoRevision === "porRevisar";
    try {
      await marcarNoSirve(id, datos);
      await recargarDocumentos();
      toast.success("Marcado como no sirve", {
        description: datos.pedirReemplazo
          ? `Le pedimos un reemplazo a ${clientesPorId[documentos.find((d) => d.id === id)?.clienteId ?? ""]?.correo ?? "el cliente"}.`
          : undefined,
      });
      if (eraPendiente) abrirSiguientePendiente(id);
    } catch {
      toast.error("No pudimos guardar la decisión. Intenta de nuevo.");
    }
  };

  const onGuardarResumen = async (id: string, resumen: string, datosClave: string) => {
    try {
      await guardarResumen(id, resumen, datosClave);
      await recargarDocumentos();
      toast.success("Resumen guardado");
    } catch {
      toast.error("No pudimos guardar el resumen. Intenta de nuevo.");
      throw new Error("guardarResumen");
    }
  };

  const botonSubir = (
    <Button size="sm">
      <Upload /> Subir documentos
    </Button>
  );

  const dialogoSubir = (trigger: React.ReactNode) => (
    <SubirDocumentosDialog
      trigger={trigger}
      clientes={clientes}
      clientePreseleccionado={clienteActual?.id}
      onSubir={onSubir}
    />
  );

  const panel = abierto ? (
    <DocumentoPanel
      documento={abierto}
      cliente={clientesPorId[abierto.clienteId]}
      onCerrar={panelFijo ? () => setAbiertoId(undefined) : undefined}
      onSirve={() => onSirve(abierto.id)}
      onNoSirve={(datos) => onNoSirve(abierto.id, datos)}
      onGuardarResumen={(r, dc) => onGuardarResumen(abierto.id, r, dc)}
    />
  ) : null;

  // ── Render ────────────────────────────────────────────────
  return (
    <main className="flex h-full min-h-0 w-full flex-col">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="type-subsection-title text-foreground">Documentos</h1>
          <p className="type-supporting text-muted-foreground">
            {carga === "listo"
              ? `${documentos.length} documentos · ${totalPendientes} por revisar`
              : " "}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              className="h-9 w-full pl-8"
              placeholder="Buscar por documento, cliente o RUT"
              aria-label="Buscar documentos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          {dialogoSubir(botonSubir)}
        </div>
      </header>

      {carga === "cargando" ? (
        <div className="flex gap-6 p-4" aria-busy="true" aria-live="polite">
          <div className="hidden w-60 space-y-2 lg:block">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex-1 space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : carga === "error" ? (
        <Empty className="m-4">
          <EmptyHeader>
            <EmptyTitle>No pudimos cargar los documentos</EmptyTitle>
            <EmptyDescription>Revisa tu conexión e inténtalo de nuevo.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" variant="outline" onClick={cargarTodo}>
              Reintentar
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:gap-6">
            <CarpetasClientes
              clientes={clientes}
              totales={totales}
              porRevisar={porRevisar}
              seleccionado={clienteSel}
              onSeleccionar={(id) => {
                setClienteSel(id);
                setAbiertoId(undefined);
              }}
            />

            <section aria-labelledby="lista-titulo" className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 id="lista-titulo" className="truncate type-section-title text-foreground">
                    {clienteActual ? clienteActual.nombre : "Todos los clientes"}
                  </h2>
                  {clienteActual ? (
                    <p className="type-meta text-muted-foreground">
                      {clienteActual.rut} · {clienteActual.materia}
                    </p>
                  ) : null}
                </div>
                <Tabs value={filtro} onValueChange={(v) => setFiltro(v as FiltroEstado)}>
                  <TabsList aria-label="Filtrar por estado">
                    {FILTROS.map((f) => (
                      <TabsTrigger key={f.value} value={f.value}>
                        {f.label}
                        <span className="ml-1 text-muted-foreground tabular-nums">{conteoFiltro(f.value)}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {deCarpeta.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderOpen className="size-6" aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>Esta carpeta está vacía</EmptyTitle>
                    <EmptyDescription>
                      Sube los documentos que envió el cliente. Se resumen solos al subirlos.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>{dialogoSubir(botonSubir)}</EmptyContent>
                </Empty>
              ) : visibles.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileSearch className="size-6" aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>
                      {busqueda
                        ? "Sin resultados"
                        : filtro === "porRevisar"
                          ? "No hay documentos por revisar"
                          : "No hay documentos en este estado"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {busqueda
                        ? `Ningún documento coincide con «${busqueda}».`
                        : "Revisa los otros estados o cambia de carpeta."}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setBusqueda("");
                        setFiltro("todos");
                      }}
                    >
                      Ver todos los documentos
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <DocumentosTabla
                  documentos={visibles}
                  clientesPorId={clientesPorId}
                  mostrarCliente={clienteSel === TODOS}
                  seleccionadoId={abiertoId}
                  onAbrir={setAbiertoId}
                />
              )}
            </section>
          </div>

          {panelFijo && panel ? (
            <aside
              aria-labelledby="documento-titulo"
              className="flex w-[420px] shrink-0 flex-col border-l border-border bg-background"
            >
              {panel}
            </aside>
          ) : null}
        </div>
      )}

      {!panelFijo ? (
        <Sheet open={Boolean(abierto)} onOpenChange={(o) => !o && setAbiertoId(undefined)}>
          <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
            <SheetTitle className="sr-only">{abierto?.nombre ?? "Documento"}</SheetTitle>
            <SheetDescription className="sr-only">Resumen y decisión sobre el documento</SheetDescription>
            {panel}
          </SheetContent>
        </Sheet>
      ) : null}
    </main>
  );
}
