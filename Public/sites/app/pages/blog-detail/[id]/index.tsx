import { getUserLanguage } from "shared/src/components/helper/Helper";
import { BlogDetail } from "shared/src/pages/blogDetail";

export default function index() {
    return (
        <BlogDetail allBlogList={{} as any} allBlogs={[]} direction={""} language={getUserLanguage()} address={{} as any} metaTags={{} as any} isSSR={false} personId={undefined} />
    );
}

