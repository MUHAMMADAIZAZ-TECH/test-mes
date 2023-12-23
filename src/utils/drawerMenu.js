import {
  Settings,
  Functions,
  FormatAlignCenter,
  Inventory,
  Draw,
  Help,
} from "@mui/icons-material";
export const BaseMenu = [
  {
    label: "General",
    icon: <Settings />,
    nestedItems: [
      { label: "Section", link: "general/section" },
      { label: "Area Type", link: "general/area-type" },
      { label: "Area", link: "general/area" },
      { label: "Equipment Type", link: "general/equipment-type" },
      { label: "Equipment", link: "general/equipment" },
      { label: "Batch Type", link: "general/batch-type" },
      { label: "Client", link: "general/client" },
      { label: "Product Category", link: "general/product-category" },
      { label: "Product/Ingredient", link: "general/product" },
      { label: "Batch Status", link: "general/batch-status" },
    ],
  },
  {
    label: "Method",
    icon: <Functions />,
    nestedItems: [
      { label: "Raw Data", link: "method/raw-data" },
      { label: "Testing Method", link: "method/testing-method" },
      { label: "Test Category", link: "method/test-category" },
      { label: "Tests", link: "method/test" },
    ],
  },
  {
    label: "Template",
    icon: <FormatAlignCenter />,
    nestedItems: [
      { label: "Stage", link: "template/stage" },
      { label: "Unit Operation", link: "template/unit-operation" },
      { label: "Step Category", link: "template/step-category" },
      { label: "Steps", link: "template/step" },
      { label: "Template Definition", link: "template/template-definition" },
      {
        label: "Manufacturing Template",
        link: "template/manufacturing-template",
      },
      { label: "Value From Previous Step", link: "template/value-from-previous-step" },
      { label: "Template Modification", link: "template/template-modification" },
      {
        label: "Value From Previous Step (Template Level Copy)", link: 'template/value-from-previous-step-template-level-copy'
      },
    ],
  },
  {
    label: "Product MPR",
    icon: <Inventory />,
    nestedItems: [
      {
        label: "Assign Product to Template",
        link: "product-mpr/assign-product-to-template",
      },
      { label: "Master Formula", link: "product-mpr/master-formula" },
      {
        label: "Ingredient Adjustment",
        link: "product-mpr/ingredient-adjustment",
      },
      { label: "Line Clearance", link: "product-mpr/line-clearance" },
      {
        label: "Assign Area Types",
        link: "product-mpr/assign-area-types",
      },
      {
        label: "Safety Instruction on Unit Operation for a Product",
        link: "product-mpr/safety-instructions",
      },
      {
        label: "Assign Equipment types to Steps",
        link: "product-mpr/assign-equipment-types",
      },
      {
        label: "Step/Product Variable",
        link: "product-mpr/step-product-variable",
      },
      {
        label: "Product Level Step Validation",
        link: "product-mpr/product-level-step-validation",
      },
      { label: "Product Level Copy", link: "product-mpr/product-level-copy" },
      { label: "Generate MPR", link: "product-mpr/mpr-generation" },
    ],
  },
  {
    label: "Electronic Signature",
    icon: <Draw />,
    nestedItems: [
      { label: "Apply ESign on MPR", link: 'electronic-signature/apply-esign-on-mpr' },
      { label: "Remove ESign from MPR", link: 'electronic-signature/remove-esign-from-mpr' },
    ],
  },
  {
    label: "Inquiry",
    icon: <Help />,
    nestedItems: [
      {
        label: "Product MPR Information",
        link: "inquiry/product-mpr-information",
      },
    ],
  },
];
export const ExecutionMenu = [
  {
    label: "Transactions",
    icon: <Settings />,
    nestedItems: [
      { label: "Assign Batch # for product", link: "transactions/assign-batch-no-for-product" },
      { label: "Initiate Batch", link: "transactions/initiate-batch" },
      { label: "Assign Materials", link: "transactions/assign-material" },
      { label: "Assign Area(s)", link: "transactions/assign-areas" },
      { label: "Assign Equipment", link: "transactions/assign-equipment" },
      { label: "Line Clearance", link: "transactions/line-clearance" },
      { label: "Ingredient Quality Adjustment", link: "transactions/ingredient-quality-adjustment" },
      { label: "Pharmacy Weighing", link: "transactions/pharmacy-weighing" },
      { label: "Manufacturing Execution", link: "transactions/manufacturing-execution" },
      { label: "Manufacturing Execution for Demo", link: "transactions/manufacturing-execution-demo" },
      { label: "Date of Manufacturing (DOM)", link: "transactions/date-of-manufacturing-(DOM)" },
      { label: "Document Upload (Unit-Operation)", link: "transactions/document-upload-(Unit-Operation)" },
      { label: "Batch Event", link: "transactions/batch-event" },
      { label: "Batch Closure", link: "transactions/batch-closure" },
    ],
  },
  {
    label: "Deviation",
    icon: <Functions />,
    nestedItems: [
      { label: "Remove Step", link: "deviation/remove-step" },
      { label: "Add Step", link: "deviation/add-step" },
      { label: "Change Ingredient", link: "deviation/change-ingredient" },
      { label: "Change Ingredient Lot #", link: "deviation/change-ingredient-lot-no" },
      { label: "Pharmacy Weighing Removal", link: "deviation/pharmacy-weighing-removal" },
    ],
  },
  {
    label: "Listing",
    icon: <FormatAlignCenter />,
    nestedItems: [
      { label: "Transactions", link: "transactions/listing" },
    ],
  },
  {
    label: "Reports",
    icon: <Inventory />,
    nestedItems: [
      { label: "Batch Review (Report)", link: "report/batch-review"},
      { label: "Periodic Review (Report)", link: "report/periodic-review" },
    ],
  },
  {
    label: "Inquiry",
    icon: <Inventory />,
    nestedItems: [
      { label: "MPR Inquiry", link: "inquiry/mpr-inquiry"},
      { label: "Process Monitoring Inquiry", link: "inquiry/process-monitoring-inquiry" },
      { label: "Batches in Manufacturing (Status)", link: "inquiry/batches-in-manufacturing-(status)" },
    ],
  },
];
