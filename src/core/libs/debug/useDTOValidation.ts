import { useEffect } from "react";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";

interface DTOValidationReport {
  isValid: boolean;
  summary: {
    flowNodes: number;
    flowEdges: number;
    meriseEntities: number;
    meriseAssociations: number;
    meriseTotalItems: number;
    meriseRelations: number;
  };
  mismatches: {
    orphanedFlowNodes: string[];
    orphanedMeriseItems: string[];
    orphanedFlowEdges: string[];
    orphanedMeriseRelations: string[];
  };
  details: string[];
}

export function useDTOValidation(flow: FlowDTOInterface, merise: MeriseDTOInterface, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const report = validateDTOConsistency(flow, merise);
    logValidationReport(report);
  }, [flow, merise, enabled]);
}

function validateDTOConsistency(flow: FlowDTOInterface, merise: MeriseDTOInterface): DTOValidationReport {
  const flowNodeIds = new Set(flow.nodes.map((node) => node.id));
  const flowEdgeIds = new Set(flow.edges.map((edge) => edge.id));

  const meriseEntityFlowIds = new Set(merise.entities.map((entity) => entity.getFlowId()));
  const meriseAssociationFlowIds = new Set(merise.associations?.map((association) => association.getFlowId()) || []);
  const allMeriseItemFlowIds = new Set([...meriseEntityFlowIds, ...meriseAssociationFlowIds]);

  const meriseRelationFlowIds = new Set(merise.relations.map((relation) => relation.getFlowId()));

  const orphanedFlowNodes = [...flowNodeIds].filter((id) => !allMeriseItemFlowIds.has(id));
  const orphanedMeriseItems = [...allMeriseItemFlowIds].filter((id) => !flowNodeIds.has(id));
  const orphanedFlowEdges = [...flowEdgeIds].filter((id) => !meriseRelationFlowIds.has(id));
  const orphanedMeriseRelations = [...meriseRelationFlowIds].filter((id) => !flowEdgeIds.has(id));

  const hasInconsistencies = orphanedFlowNodes.length > 0 || orphanedMeriseItems.length > 0 || orphanedFlowEdges.length > 0 || orphanedMeriseRelations.length > 0;

  const details: string[] = [];

  if (orphanedFlowNodes.length > 0) {
    details.push(`❌ ${orphanedFlowNodes.length} Flow Nodes sans Item Merise correspondant (Entity/Association)`);
  }

  if (orphanedMeriseItems.length > 0) {
    details.push(`❌ ${orphanedMeriseItems.length} Items Merise (Entities/Associations) sans Flow Node correspondant`);
  }

  if (orphanedFlowEdges.length > 0) {
    details.push(`❌ ${orphanedFlowEdges.length} Flow Edges sans Relation Merise correspondante`);
  }

  if (orphanedMeriseRelations.length > 0) {
    details.push(`❌ ${orphanedMeriseRelations.length} Relations Merise sans Flow Edge correspondant`);
  }

  if (!hasInconsistencies) {
    details.push("✅ Cohérence parfaite entre Flow et Merise");
  }

  const meriseAssociationsCount = merise.associations?.length || 0;
  const meriseTotalItems = merise.entities.length + meriseAssociationsCount;

  return {
    isValid: !hasInconsistencies,
    summary: {
      flowNodes: flow.nodes.length,
      flowEdges: flow.edges.length,
      meriseEntities: merise.entities.length,
      meriseAssociations: meriseAssociationsCount,
      meriseTotalItems,
      meriseRelations: merise.relations.length,
    },
    mismatches: {
      orphanedFlowNodes,
      orphanedMeriseItems,
      orphanedFlowEdges,
      orphanedMeriseRelations,
    },
    details,
  };
}

function logValidationReport(report: DTOValidationReport) {
  const statusIcon = report.isValid ? "✅" : "⚠️";
  const statusText = report.isValid ? "COHÉRENT" : "INCOHÉRENCES DÉTECTÉES";

  console.groupCollapsed(`${statusIcon} [DTO Validation] État: ${statusText}`);

  console.group("📊 Couche Flow (Diagramme)");
  console.table({
    Nodes: report.summary.flowNodes,
    Edges: report.summary.flowEdges,
  });
  console.groupEnd();

  console.group("🏗️ Couche Merise (Modèle Métier)");
  console.table({
    Entities: report.summary.meriseEntities,
    Associations: report.summary.meriseAssociations,
    Relations: report.summary.meriseRelations,
  });
  console.groupEnd();

  console.group("🔗 Correspondances Cross-Layer");
  const nodeItemBalance = report.summary.flowNodes - report.summary.meriseTotalItems;
  const edgeRelationBalance = report.summary.flowEdges - report.summary.meriseRelations;

  console.table({
    "Flow Nodes": report.summary.flowNodes,
    "Merise Items (E+A)": report.summary.meriseTotalItems,
    "Balance N↔I": nodeItemBalance === 0 ? "✅ OK" : `⚠️ ${nodeItemBalance > 0 ? "+" : ""}${nodeItemBalance}`,
    "Flow Edges": report.summary.flowEdges,
    "Merise Relations": report.summary.meriseRelations,
    "Balance E↔R": edgeRelationBalance === 0 ? "✅ OK" : `⚠️ ${edgeRelationBalance > 0 ? "+" : ""}${edgeRelationBalance}`,
  });
  console.groupEnd();

  if (nodeItemBalance !== 0 || edgeRelationBalance !== 0) {
    console.group("⚖️ Analyse des déséquilibres:");
    if (nodeItemBalance !== 0) {
      const balanceIcon = nodeItemBalance > 0 ? "📈" : "📉";
      const balanceText = nodeItemBalance > 0 ? "Plus de Nodes Flow que d'Items Merise" : "Plus d'Items Merise que de Nodes Flow";
      console.log(`${balanceIcon} Nodes vs Items: ${nodeItemBalance > 0 ? "+" : ""}${nodeItemBalance} (${balanceText})`);
    }
    if (edgeRelationBalance !== 0) {
      const balanceIcon = edgeRelationBalance > 0 ? "📈" : "📉";
      const balanceText = edgeRelationBalance > 0 ? "Plus d'Edges Flow que de Relations Merise" : "Plus de Relations Merise que d'Edges Flow";
      console.log(`${balanceIcon} Edges vs Relations: ${edgeRelationBalance > 0 ? "+" : ""}${edgeRelationBalance} (${balanceText})`);
    }
    console.groupEnd();
  }

  if (report.details.length > 0) {
    console.group("📋 Détails de validation:");
    report.details.forEach((detail) => console.log(detail));
    console.groupEnd();
  }

  if (!report.isValid) {
    console.group("🔍 Incohérences détaillées:");

    if (report.mismatches.orphanedFlowNodes.length > 0) {
      console.warn("Flow Nodes orphelins:", report.mismatches.orphanedFlowNodes);
    }

    if (report.mismatches.orphanedMeriseItems.length > 0) {
      console.warn("Items Merise orphelins (Entities/Associations):", report.mismatches.orphanedMeriseItems);
    }

    if (report.mismatches.orphanedFlowEdges.length > 0) {
      console.warn("Flow Edges orphelins:", report.mismatches.orphanedFlowEdges);
    }

    if (report.mismatches.orphanedMeriseRelations.length > 0) {
      console.warn("Relations Merise orphelines:", report.mismatches.orphanedMeriseRelations);
    }

    console.groupEnd();
  }

  console.groupEnd();
}
