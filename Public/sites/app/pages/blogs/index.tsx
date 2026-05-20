
import { getUserLanguage } from "shared/src/components/helper/Helper";
import { Blogs } from "shared/src/pages/blogs/Blogs";

export default function index() {
    return (
        <Blogs recordsCount={0} allBlogList={[]} direction={""} language={getUserLanguage()} address={{} as any} metaTags={{} as any} isSSR={false} personId={undefined} />
    );
}
