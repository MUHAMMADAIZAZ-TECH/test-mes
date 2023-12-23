import React, { useState } from "react";
import { List, ListItem, ListItemText, Checkbox } from "@mui/material";

function areObjectsEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const transformData = (data) => {
  const transformedData = {
    id: "root",
    name: "Template",
    children: data.stage?.map((stage) => ({
      id: `${stage.stageCode}`,
      name: `${stage.stageDesc}`,
      stageLevel: stage.stgLevelNo,
      type: "stage",
      children: data.unitOperation
        .filter((uo) => uo.stgLevelNo === stage.stgLevelNo)
        .map((uo) => ({
          id: `${uo.mpUnitCode}`,
          name: `${uo.mpUnitDesc}`,
          unitOperationLevel: uo.uoLevelNo,
          stageLevel: stage.stgLevelNo,
          type: "unitOp",
          children: data.step
            .filter(
              (step) =>
                step.uoLevelNo === uo.uoLevelNo &&
                step.stgLevelNo === stage.stgLevelNo
            )
            .map((step) => ({
              id: `${step.stepCode}`,
              name: `${step.stepDesc}`,
              stepLevel: step.stpLevelNo,
              unitOperationLevel: uo.uoLevelNo,
              stageLevel: stage.stgLevelNo,
              type: "step",
            })),
        })),
    })),
  };
  return transformedData;
};

export default function TreeView({ data, onSelectLevel }) {
  const transformedData = transformData(data);

  const [selectedNode, setSelectedNode] = useState({});

  const handleNodeClick = (node) => {
    if (areObjectsEqual(selectedNode, node)) {
      setSelectedNode({});
      onSelectLevel({});
    } else {
      setSelectedNode(node);
      const { children, ...nodeWithoutChildren } = node;
      onSelectLevel(nodeWithoutChildren);
    }
  };

  const renderList = (nodes) => (
    <>
      {nodes.id !== "root" && (
        <ListItem
          sx={{
            margin: 0,
            padding: 0,
            height: 28,
            paddingLeft: !nodes.unitOperationLevel
              ? 0
              : !nodes.stepLevel
              ? 4
              : 11,
          }}
          button
          onClick={() => handleNodeClick(nodes)}
        >
          {!nodes.stepLevel && (
            <Checkbox
              disableRipple
              checked={areObjectsEqual(nodes, selectedNode)}
              size="small"
              sx={{
                borderRadius: 0,
              }}
            />
          )}
          <ListItemText
            sx={{
              paddingX: 0.5,
              backgroundColor: areObjectsEqual(nodes, selectedNode)
                ? "#1976d2"
                : "transparent",
              color: areObjectsEqual(nodes, selectedNode) ? "#fff" : "#000",
            }}
            primary={nodes.name}
          />
        </ListItem>
      )}
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderList(node, nodes))
        : null}
    </>
  );

  return (
    <div
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        minHeight: "550px",
        maxHeight: "550px",
      }}
    >
      <List component="nav" aria-label="tree-like component">
        {renderList(transformedData)}
      </List>
    </div>
  );
}
