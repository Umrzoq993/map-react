export default function OrgTree({ tree, onSelect }) {
  const renderNode = (node) => (
    <li key={node.id} style={{ marginBottom: 4 }}>
      <button
        onClick={() => onSelect(node.id)}
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        {node.name}
      </button>
      {node.children?.length > 0 && (
        <ul style={{ marginLeft: 16, listStyle: "none", paddingLeft: 0 }}>
          {node.children.map(renderNode)}
        </ul>
      )}
    </li>
  );
  return (
    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {tree.map(renderNode)}
    </ul>
  );
}
