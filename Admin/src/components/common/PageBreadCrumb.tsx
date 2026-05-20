import { Link } from "react-router-dom";;

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 mb-2">
 <h2
        className="font-semibold text-gray-800 dark:text-white/90 text-xl"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav className="w-full px-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-gray-800 dark:text-white/90 text-sm">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
