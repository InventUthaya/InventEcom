import { useRouter } from "next/router";
import Link from "next/link";
import Container from "../../animation/Container";

export default function PageNotFound() {
    const navigate = useRouter();

    return (
        <Container>
            <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-[#EA002A]">
                        404
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Not Found
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        Sorry, we couldn’t find the page you’re looking for.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href={'/'}
                            className="rounded-md bg-[#EA002A] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#EA002A99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA002A]"
                        >
                            Go back home
                        </Link>
                        <Link
                            href="#"
                            className="rounded-md border border-[#EA002A] px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:border-[#EA002A99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA002A]"
                            onClick={() => navigate.push('/')}
                        >
                            <span>
                                &larr;
                            </span>{" "}
                            back
                        </Link>
                    </div>
                </div>
            </main>
        </Container>
    );
}
