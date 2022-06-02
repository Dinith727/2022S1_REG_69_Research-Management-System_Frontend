import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface Props {
  header: any;
  columns: any;
  data: any;
  actions?: any;
}

const Index: React.FC<Props> = ({ header, columns, data, actions }) => {
  const [items, setItems] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    setItems(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const dynamicColumns = columns.map((col: any) => {
    return (
      <Column key={col.field} field={col.field} header={col.header} sortable />
    );
  });

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h2>{header}</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <DataTable
          value={items}
          responsiveLayout="scroll"
          header={renderHeader()}
          filters={filters}
        >
          {dynamicColumns}
          {actions && (
            <Column
              headerStyle={{ width: "4rem", textAlign: "center" }}
              body={(row) => actions(row)}
            />
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default Index;
