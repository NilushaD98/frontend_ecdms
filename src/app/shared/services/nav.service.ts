import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, fromEvent, Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";

export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}
@Injectable({
  providedIn: "root",
})
export class NavService {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
        .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
        .subscribe((evt: any) => {
          this.setScreenWidth(evt.target.innerWidth);
          if (evt.target.innerWidth < 991) {
            this.collapseSidebar = true;
          }
          if (evt.target.innerWidth < 1199) {
          }
        });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
      });
    }
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      title: "Manage Users",
      icon: "users",
      type: "sub",
      active: true,
      children: [
        { path: "/student-management/manage-student", title: "Students", type: "link" },
        { path: "/student-management/manage-teacher", title: "Teachers", type: "link" },
      ],
    },
    {
      title: "Digital Portfolio",
      icon: "users",
      type: "sub",
      active: true,
      children: [
        { path: "/digital-portfolio/profile", title: "Digital Portfolio", type: "link" },
        { path: "/digital-portfolio/add-post", title: "Add Announcement", type: "link" },
      ],
    },
    // {
    //   title: "Dashboards",
    //   icon: "home",
    //   type: "sub",
    //   badgeType: "light-primary",
    //   badgeValue: "2",
    //   active: false,
    //   children: [
    //     { path: "/dashboard/default", title: "Default", type: "link" },
    //     { path: "/dashboard/ecommerce", title: "Ecommerce", type: "link" },
    //     { path: "/dashboard/crypto", title: "Crypto", type: "link" },
    //   ],
    // },
    // {
    //   title: "Company",
    //   icon: "home",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/company/chart-of-account", title: "Chart Of Accounts", type: "link" },
    //     { path: "/company/journal-entries", title: "Journal Entries", type: "link" },
    //     { path: "/company/entry-authorization", title: "Entry Authorization", type: "link" },
    //     { path: "/company/exchange-rates", title: "Exchange Rates", type: "link" },
    //     { path: "/company/finance-year-closing", title: "Financial Year Closing", type: "link" },
    //     { path: "/company/item-master", title: "Item Master", type: "link" },
    //     { path: "/company/date-controller", title: "Date Controller", type: "link" },
    //     {
    //       title: "System User Management",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         {
    //           path: "/company/role-management", title: "Role Management", type: "link"
    //         },
    //         {
    //           path:"/company/user-management",title:"User Management", type:"link"
    //         }
    //       ]
    //     },
    //   ],
    // },
    // {
    //   title: "Customer",
    //   icon: "users",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/customer/invoice", title: "Invoice", type: "link" },
    //     { path: "/customer/credit-note", title: "Credit Note", type: "link" },
    //     { path: "/customer/customer-master", title: "Customer Master", type: "link" },
    //     { path: "/customer/customer-opening-balance", title: "Customer Opening Balance", type: "link" },
    //   ],
    // },
    // {
    //   title: "Receipt",
    //   icon: "project",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/receipt/customer-receipt-management", title: "Customer Receipt", type: "link" },
    //   ],
    // },
    // {
    //   title: "Vendors",
    //   icon: "users",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/vendors/vendor-registration", title: "Vendor Registration", type: "link" },
    //     { path: "/vendors/bills-management", title: "Bills", type: "link" },
    //     { path: "/vendors/vendor-credit", title: "Vendor Credit", type: "link" },
    //     { path: "/vendors/vendor-opening-balance", title: "Vendor Opening Balance", type: "link" },
    //   ],
    // },
    // {
    //   title: "Payments",
    //   icon: "forms",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/payments/pay-bill", title: "Pay Bill", type: "link" },
    //   ],
    // },
    // {
    //   title: "Bank",
    //   icon: "jobsearch",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/bank/bank-reconciliation", title: "Bank Reconciliation", type: "link" },
    //     { path: "/bank/write-cheque-management", title: "Write Cheque Management", type: "link" },
    //     { path: "/bank/print-cheque", title: "print Cheque", type: "link" },
    //     { path: "/bank/spend-money", title: "Spend Money", type: "link" },
    //     { path: "/bank/receive-money", title: "Receive Money", type: "link" },
    //     { path: "/bank/loan", title: "Loan", type: "link" },
    //     { path: "/bank/fixed-deposit", title: "Fixed Deposit", type: "link" },
    //   ],
    // },
    // {
    //   title: "Purchasing",
    //   icon: "page",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/purchasing/purchase-requisition-note", title: "Purchase Requisition Note", type: "link" },
    //     { path: "/purchasing/purchase-order", title: "Purchase Order", type: "link" },
    //     { path: "/purchasing/purchase-order-progress", title: "Purchase Order Progress", type: "link" },
    //   ],
    // },
    // {
    //   title: "Inventory",
    //   icon: "file",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/inventory/good-receive-note", title: "Good Receive Note", type: "link" },
    //     { path: "/inventory/dispatch", title: "Dispatch", type: "link" },
    //   ],
    // },
    // {
    //   title: "Report Center",
    //   icon: "ticket",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     {
    //       title: "Vendors Payable",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/vendors-payable/aging-detail", title: "Aging Detail", type: "link" },
    //         { path: "/report-center/vendors-payable/payment-details-report", title: "Payment Details Report", type: "link" },
    //         { path: "/report-center/vendors-payable/payment-settlement-report", title: "Payment Settlement Report", type: "link" },
    //         { path: "/report-center/vendors-payable/vendor-transactions", title: "Vendor Transactions", type: "link" },
    //         { path: "/report-center/vendors-payable/vendor-transactions-summary", title: "Vendor Transactions Summary", type: "link" },
    //         { path: "/report-center/vendors-payable/vendor-outstanding-report", title: "Vendor Outstanding Report", type: "link" },
    //         { path: "/report-center/vendors-payable/vendor-credit-summary", title: "Vendor Credit Summary", type: "link" },
    //         { path: "/report-center/vendors-payable/vendor-movement-report", title: "Vendor Movement Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Purchasing",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/purchasing/purchase-summary", title: "Purchase Summary", type: "link" },
    //         { path: "/report-center/purchasing/po-summary", title: "PO Summary", type: "link" },
    //         { path: "/report-center/purchasing/prn-summary", title: "PRN Summary", type: "link" },
    //         { path: "/report-center/purchasing/open-po-report", title: "Open PO Report", type: "link" },
    //         { path: "/report-center/purchasing/po-delivery-delay-report", title: "PO Delivery Delay Report", type: "link" },
    //         { path: "/report-center/purchasing/purchase-analysis-report", title: "Purchase Analysis Report", type: "link" },
    //         { path: "/report-center/purchasing/latest-item-price-report", title: "Latest Item Price Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Inventory",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/inventory/stock-availability", title: "Stock Availability", type: "link" },
    //         { path: "/report-center/inventory/grn-available-quantities", title: "GRN Available Quantities", type: "link" },
    //         { path: "/report-center/inventory/inventory-item-list-report", title: "Inventory Item List Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Customers & Receivables",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/customers-receivables/aging-detail", title: "Aging Detail", type: "link" },
    //         { path: "/report-center/customers-receivables/received-payments-details", title: "Received Payments Details", type: "link" },
    //         { path: "/report-center/customers-receivables/customer-transactions", title: "Customer Transactions", type: "link" },
    //         { path: "/report-center/customers-receivables/customer-outstanding-report", title: "Customer Outstanding Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Account Taxes",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/account-taxes/trial-balance", title: "Trial Balance", type: "link" },
    //         { path: "/report-center/account-taxes/general-ledger", title: "General Ledger", type: "link" },
    //         { path: "/report-center/account-taxes/ledger-report", title: "Ledger Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Bank",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/bank/loan-fd-detailed-report", title: "Loan/FD Detailed Report", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Company Financial",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/report-center/company-financial/profit-loss", title: "Profit Loss", type: "link" },
    //         { path: "/report-center/company-financial/gp-comparison", title: "GP Comparison", type: "link" },
    //         { path: "/report-center/company-financial/balance-sheet-summary", title: "Balance Sheet Summary", type: "link" },
    //       ],
    //     },
    //   ],
    // },
    //
    // /*{
    //   title: "Dashboards",
    //   icon: "home",
    //   type: "sub",
    //   badgeType: "light-primary",
    //   badgeValue: "2",
    //   active: true,
    //   children: [
    //     { path: "/dashboard/default", title: "Default", type: "link" },
    //     { path: "/dashboard/ecommerce", title: "Ecommerce", type: "link" },
    //     { path: "/dashboard/crypto", title: "Crypto", type: "link" },
    //   ],
    // },*/
    // {
    //   title: "Widgets",
    //   icon: "widgets",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/widgets/general", title: "General", type: "link" },
    //     { path: "/widgets/chart", title: "Chart", type: "link" },
    //   ],
    // },
    // {
    //   title: "Page layout",
    //   icon: "page",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/page-layout/hide-nav-scroll", title: "Hide New Scroll", type: "link" },
    //     { path: "/page-layout/footer-light", title: "Footer Light", type: "link" },
    //     { path: "/page-layout/footer-dark", title: "footer Dark", type: "link" },
    //     { path: "/page-layout/footer-fixed", title: "Footer Fixed", type: "link" },
    //   ],
    // },
    // {
    //   title: "Project",
    //   icon: "project",
    //   type: "sub",
    //   badgeType: "light-info",
    //   badgeValue: "New",
    //   active: false,
    //   children: [
    //     { path: "/project/project-list", title: "Project List", type: "link" },
    //     { path: "/project/create-new", title: "Create New", type: "link" },
    //   ],
    // },
    // { path: "/file-manager", title: "File Manager", icon: "file", type: "link" },
    // {
    //   title: "E-Commerce",
    //   icon: "ecommerce",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/e-commerce/product", title: "Product", type: "link" },
    //     { path: "/e-commerce/product-page", title: "Product Page", type: "link" },
    //     { path: "/e-commerce/product-list", title: "Product List", type: "link" },
    //     { path: "/e-commerce/add-product", title: "Add Product", type: "link" },
    //     { path: "/e-commerce/payment-details", title: "Payment Details", type: "link" },
    //     { path: "/e-commerce/order-history", title: "Order History", type: "link" },
    //     { path: "/e-commerce/invoice", title: "Invoice", type: "link" },
    //     { path: "/e-commerce/cart", title: "Cart", type: "link" },
    //     { path: "/e-commerce/wishlist", title: "Wishlist", type: "link" },
    //     { path: "/e-commerce/checkout", title: "Checkout", type: "link" },
    //     { path: "/e-commerce/pricing", title: "Pricing", type: "link" },
    //   ],
    // },
    // {
    //   title: "Email",
    //   icon: "email",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/email/email-app", title: "Email App", type: "link" },
    //     { path: "/email/read-mail", title: "Read Mail", type: "link" },
    //     { path: "/email/email-compose", title: "Email Compose", type: "link" },
    //   ],
    // },
    // {
    //   title: "Chat",
    //   icon: "chat",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/chat/chat-app", title: "Chat App", type: "link" },
    //     { path: "/chat/video-chat", title: "Video Chat", type: "link" },
    //   ],
    // },
    // {
    //   title: "Users",
    //   icon: "users",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/users/users-profile", title: "Users Profile", type: "link" },
    //     { path: "/users/users-edit", title: "Users Edit", type: "link" },
    //     { path: "/users/users-cards", title: "Users Cards", type: "link" },
    //   ],
    // },
    // { path: "/bookmark", title: "Bookmark", icon: "bookmark", type: "link" },
    // { path: "/task", title: "Task", icon: "task", type: "link", bookmark: true },
    // { path: "/contacts", title: "Contacts", icon: "contacts", type: "link", bookmark: true },
    // { path: "/calender", title: "Calender", icon: "calender", type: "link" },
    // { path: "/social-app", title: "Social App", icon: "social", type: "link" },
    // { path: "/to-do", title: "To-Do", icon: "todo", type: "link", bookmark: true },
    // { path: "/search-website", title: "Search Website", icon: "website", type: "link" },
    // {
    //   title: "Forms",
    //   icon: "forms",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     {
    //       title: "Form Controls",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/forms/form-controls/form-validation", title: "Form Validation", type: "link" },
    //         { path: "/forms/form-controls/base-inputs", title: "Base Inputs", type: "link" },
    //         { path: "/forms/form-controls/checkbox-radio", title: "Checkbox & Radio", type: "link" },
    //         { path: "/forms/form-controls/input-groups", title: "Input Groups", type: "link" },
    //         { path: "/forms/form-controls/mega-options", title: "Mega Options", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Form Widgets",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/forms/form-widgets/datepicker", title: "Datepicker", type: "link" },
    //         { path: "/forms/form-widgets/date-rangepicker", title: "DateRangePicker", type: "link" },
    //         { path: "/forms/form-widgets/touchspin", title: "Touchspin", type: "link" },
    //         { path: "/forms/form-widgets/select2", title: "Select2", type: "link" },
    //         { path: "/forms/form-widgets/switch", title: "Switch", type: "link" },
    //         { path: "/forms/form-widgets/typeahead", title: "Typeahead", type: "link" },
    //         { path: "/forms/form-widgets/clipboard", title: "Clipboard", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Form Layout",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/forms/form-layout/default-forms", title: "Default Forms", type: "link" },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: "Tables",
    //   icon: "tables",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/tables/bootstrap-tables/basic-tables", title: "Bootstrap Tables", type: "link" },
    //     { path: "/tables/data-tables/basic-init", title: "Basic Init", type: "link" },
    //   ],
    // },
    // {
    //   title: "Ui Kits",
    //   icon: "uikits",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/ui-kits/typography", title: "Typography", type: "link" },
    //     { path: "/ui-kits/avatars", title: "avatars", type: "link" },
    //     { path: "/ui-kits/helpers-classes", title: "Helpers Classes", type: "link" },
    //     { path: "/ui-kits/grid", title: "Grid", type: "link" },
    //     { path: "/ui-kits/tag-and-pills", title: "Tag & Pills", type: "link" },
    //     { path: "/ui-kits/progress", title: "Progress", type: "link" },
    //     { path: "/ui-kits/modal", title: "Modal", type: "link" },
    //     { path: "/ui-kits/alert", title: "Alert", type: "link" },
    //     { path: "/ui-kits/popover", title: "Popover", type: "link" },
    //     { path: "/ui-kits/tooltip", title: "Tooltip", type: "link" },
    //     { path: "/ui-kits/toaster", title: "Toaster", type: "link" },
    //     { path: "/ui-kits/spinners", title: "Spinners", type: "link" },
    //     { path: "/ui-kits/dropdown", title: "Dropdown", type: "link" },
    //     { path: "/ui-kits/according", title: "According", type: "link" },
    //     {
    //       path: "/ui-kits/tabs",
    //       title: "Tabs",
    //       type: "sub",
    //       children: [
    //         { path: "/ui-kits/tabs/bootstrap-tabs", title: "Bootstraps Tabs", type: "link" },
    //         { path: "/ui-kits/tabs/line-tabs", title: "Line tabs", type: "link" },
    //       ],
    //     },
    //     { path: "/ui-kits/lists", title: "Lists", type: "link" },
    //   ],
    // },
    // {
    //   title: "Others",
    //   icon: "other",
    //   type: "sub",
    //   children: [
    //     {
    //       title: "Error Pages",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/error-page/error-page1", title: "Error page 1", type: "link" },
    //         { path: "/error-page/error-page2", title: "Error page 2", type: "link" },
    //         { path: "/error-page/error-page3", title: "Error page 3", type: "link" },
    //         { path: "/error-page/error-page4", title: "Error page 4", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Authentication",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/authentication/login/login-simple", title: "Login Simple", type: "link" },
    //         { path: "/authentication/login/login-image-one", title: "Login with bg image", type: "link" },
    //         { path: "/authentication/login/login-image-two", title: "Login with image two", type: "link" },
    //         { path: "/authentication/login/validation", title: "Login With Validation", type: "link" },
    //         { path: "/authentication/login/tooltip", title: "Login With Tooltip", type: "link" },
    //         { path: "/authentication/login/sweetalert", title: "Login With Sweetalert", type: "link" },
    //         { path: "/authentication/register/register-simple", title: "Register Simple", type: "link" },
    //         { path: "/authentication/register/register-bg-image", title: "Register With Bg Image", type: "link" },
    //         { path: "/authentication/register/register-bg-video", title: "Register With Bg Video", type: "link" },
    //         { path: "/authentication/unlock-user", title: "Unlock User", type: "link" },
    //         { path: "/authentication/forgot-password", title: "Forgot Password", type: "link" },
    //         { path: "/authentication/create-password", title: "Create Password", type: "link" },
    //         { path: "/authentication/maintenance", title: "Maintenance", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Coming Soon",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "/coming-soon/coming-simple", title: "Coming Simple", type: "link" },
    //         { path: "/coming-soon/coming-bg-image", title: "Coming With bg image", type: "link" },
    //       ],
    //     },
    //     {
    //       title: "Email templates",
    //       type: "sub",
    //       active: false,
    //       children: [
    //         { path: "http://admin.pixelstrap.com/zeta/theme/basic-template.html", title: "Basic Email", type: "extTabLink" },
    //         { path: "http://admin.pixelstrap.com/zeta/theme/email-header.html", title: "Basic With Header", type: "extTabLink" },
    //         { path: "http://admin.pixelstrap.com/zeta/theme/template-email-2.html", title: "Email Template 2", type: "extTabLink" },
    //         { path: "http://admin.pixelstrap.com/zeta/theme/ecommerce-templates.html", title: "Ecommerce Email", type: "extTabLink" },
    //         { path: "http://admin.pixelstrap.com/zeta/theme/email-order-success.html", title: "Order Success", type: "extTabLink" },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: "Bonus Ui",
    //   icon: "bonusui",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/bonus-ui/rating", title: "Rating", type: "link" },
    //     { path: "/bonus-ui/dropzone", title: "Dropzone", type: "link" },
    //     { path: "/bonus-ui/tour", title: "Tour", type: "link" },
    //     { path: "/bonus-ui/sweetAlert2", title: "SweetAlert2", type: "link" },
    //     { path: "/bonus-ui/owl-carousel", title: "Owl Carousel", type: "link" },
    //     { path: "/bonus-ui/ribbons", title: "Ribbons", type: "link" },
    //     { path: "/bonus-ui/pagination", title: "Pagination", type: "link" },
    //     { path: "/bonus-ui/breadcrumb", title: "Breadcrumb", type: "link" },
    //     { path: "/bonus-ui/steps", title: "Steps", type: "link" },
    //     { path: "/bonus-ui/range-slider", title: "Rang Slider", type: "link" },
    //     { path: "/bonus-ui/image-cropper", title: "Image cropper", type: "link" },
    //     { path: "/bonus-ui/sticky", title: "Sticky", type: "link" },
    //     { path: "/bonus-ui/basic-card", title: "Basic Card", type: "link" },
    //     { path: "/bonus-ui/draggable-card", title: "Draggable Card", type: "link" },
    //     { path: "/bonus-ui/timeline1", title: "Time Line", type: "link" },
    //   ],
    // },
    // {
    //   title: "Icons",
    //   icon: "icons",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/icon/flag-icon", title: "Flag Icon", type: "link" },
    //     { path: "/icon/fontawesome-icon", title: "Fontawsome", type: "link" },
    //     { path: "/icon/ico-icon", title: "Ico Icon", type: "link" },
    //     { path: "/icon/thimify-icon", title: "Themify Icon", type: "link" },
    //     { path: "/icon/feather-icon", title: "Feather Icon", type: "link" },
    //     { path: "/icon/whether-icon", title: "Whether Icon", type: "link" },
    //   ],
    // },
    // { path: "/buttons", title: "Buttons", icon: "buttons", type: "link" },
    // {
    //   path: "/charts",
    //   title: "Charts",
    //   icon: "charts",
    //   active: false,
    //   type: "sub",
    //   children: [
    //     { path: "/charts/apex-chart", title: "Apex Chart", type: "link" },
    //     { path: "/charts/google-chart", title: "Google Chart", type: "link" },
    //     { path: "/charts/chartjs", title: "Chartjs Chart", type: "link" },
    //     { path: "/charts/chartist-chart", title: "Chartist Chart", type: "link" },
    //   ],
    // },
    // { path: "/sample-page", title: "Sample Page", icon: "buttons", type: "link" },
    // {
    //   path: "/gallery",
    //   title: "Gallery",
    //   icon: "gallery",
    //   active: false,
    //   type: "sub",
    //   children: [
    //     { path: "/gallery/gallery-grid", title: "Gallery Grid", type: "link" },
    //     { path: "/gallery/gallery-grid-desc", title: "Gallery Grid Desc", type: "link" },
    //     { path: "/gallery/masonry-gallery", title: "Masonry Gallery", type: "link" },
    //     { path: "/gallery/masonry-with-desc", title: "Masonry With Desc", type: "link" },
    //     { path: "/gallery/hover-effects", title: "Hover Effects", type: "link" },
    //   ],
    // },
    // {
    //   path: "/blog",
    //   title: "Blog",
    //   icon: "blog",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/blog/blog-details", title: "Blog Details", type: "link" },
    //     { path: "/blog/blog-single", title: "Blog Single", type: "link" },
    //     { path: "/blog/add-post", title: "Add Post", type: "link" },
    //   ],
    // },
    // { path: "/faq", title: "Faq", icon: "faq", type: "link" },
    // {
    //   path: "/job-search",
    //   title: "Job Search",
    //   icon: "jobsearch",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/job-search/cards-view", title: "Cards View", type: "link" },
    //     { path: "/job-search/list-view", title: "List View", type: "link" },
    //     { path: "/job-search/job-details", title: "Job Details", type: "link" },
    //     { path: "/job-search/apply", title: "Apply", type: "link" },
    //   ],
    // },
    // {
    //   path: "/learning",
    //   title: "Learning",
    //   icon: "learning",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/learning/learning-list", title: "Learning List", type: "link" },
    //     { path: "/learning/detailed-course", title: "Detailed Course", type: "link" },
    //   ],
    // },
    // {
    //   path: "/maps",
    //   title: "Maps",
    //   icon: "maps",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/maps/map-js", title: "Google Map", type: "link" },
    //     { path: "/maps/leaflet-map", title: "Leaflet", type: "link" },
    //   ],
    // },
    // {
    //   path: "/editors",
    //   title: "Editors",
    //   icon: "editors",
    //   type: "sub",
    //   active: false,
    //   children: [
    //     { path: "/editors/ck-editors", title: "CK Editors", type: "link" },
    //     { path: "/editors/kolkov-editors", title: "Kolkov Editors", type: "link" },
    //   ],
    // },
    // {
    //   path: "/knowledgebases",
    //   title: "Knowledgebase",
    //   icon: "knowledgebase",
    //   active: false,
    //   type: "sub",
    //   children: [
    //     { path: "/knowledgebases/knowledgebase", title: "Knowledgebase", type: "link" },
    //     { path: "/knowledgebases/knowledge-category", title: "Knowledge category", type: "link" },
    //     { path: "/knowledgebases/knowledge-detail", title: "Knowledge detail", type: "link" },
    //   ],
    // },
    // { path: "/support-ticket", title: "Support Ticket", icon: "ticket", type: "link" },
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
