import { InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Dropdown from '../components/Dropdown';
import { Toaster } from 'react-hot-toast';

interface FileType {
	path: string,
	size: number
}

const builtins = ['example', 'fig', '@withfig'];

export default function Home({ files }: { files: InferGetStaticPropsType<typeof getStaticProps>['files'] }) {
	const [showSize, setShowSize] = useState(true);
	const [showBuiltins, setShowBuiltins] = useState(true);
	const [searchValue, setSearchValue] = useState('');

	const { asPath } = useRouter();

	const meta = {
		title: 'Fig Spec Viewer',
		description: 'List of all specifications Fig includes.',
		type: 'website'
	}

	return (
		<div className="flex justify-center mx-auto py-8 px-4 lg:px-0">
			<Head>
				<title>{meta.title}</title>
				<meta name="robots" content="follow, index" />
				<meta content={meta.description} name="description" />
				<meta property="og:url" content={`https://lavya.me${asPath}`} />
				<meta property="og:type" content={meta.type} />
				<meta property="og:site_name" content="Lavya Gupta" />
				<meta property="og:description" content={meta.description} />
				<meta property="og:title" content={meta.title} />
				<meta name="twitter:site" content="@lavgup" />
				<meta name="twitter:title" content={meta.title} />
				<meta name="twitter:description" content={meta.description} />
			</Head>

			<div className="max-w-4xl w-full">
				<div className="flex flex-row flex-wrap justify-between items-center mb-1">
					<h1 className="dark:text-white text-4xl font-bold mb-2 mr-4">
						Fig Spec Viewer
					</h1>

					<a
						href="https://github.com/lavgup/fig-specs"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 mb-2 w-fit rounded-lg bg-neutral-300/80 dark:bg-neutral-700/[.55] dark:text-neutral-100/80 px-2 py-1.5"
					>
						<GitHubIcon className="w-h h-5" />
						<p className="text-xs mt-0.5">GitHub</p>
					</a>
				</div>

				<p className="dark:text-white">
					List of all specifications{' '}
					<a
						className="text-purple-700 dark:text-purple-300 underline"
						href="https://github.com/withfig/autocomplete/tree/master/src">Fig
					</a>{' '}
					includes.
				</p>

				<div className="flex justify-between items-center">
					<div className="relative items-center w-[100%] md:w-[50%]">
						<SearchIcon
							className="absolute text-gray-400 h-[1.15rem] left-2 top-[1.275rem] dark:text-gray-300" />

						<input
							type="search"
							className="py-1 px-1.5 pl-8 mt-3 w-4/5 bg-transparent dark:text-neutral-200 rounded-md border border-md outline-none border-neutral-300/80 dark:border-neutral-800"
							placeholder="Search"
							onChange={e => setSearchValue(e.target.value)}
						/>
					</div>

					<Dropdown
						showSize={showSize}
						setShowSize={setShowSize}
						showBuiltins={showBuiltins}
						setShowBuiltins={setShowBuiltins}
					/>
				</div>

				<div className="flex flex-col mt-4">
					{Object.entries(files)
						.sort(([, a], [, b]) => b.length - a.length)
						.map(([key, files]) => {
							const name = path => path.replace(`${key}/`, '');

							const filtered = files
								.filter(({ path }) => searchValue ? name(path).toLowerCase().includes(searchValue.toLowerCase()) : true)
								.sort((a, b) => name(a.path).localeCompare(name(b.path)));

							const hideBuiltin = !showBuiltins && builtins.includes(key);

							return (
								<div
									key={key}
									className={filtered.length ? hideBuiltin ? 'hidden' : '' : 'hidden'}
								>
									<div className="flex flex-row gap-1.5 items-center">
										<h2 className="font-semibold uppercase dark:text-neutral-200/90 mt-2 mb-1.5">
											{key.replace('_rest', 'Main')}
										</h2>
										<a
											href={`https://github.com/withfig/autocomplete/tree/master/src/${key === '_rest' ? '' : key}`}
											rel="noopener noreferrer"
											target="_blank"
										>
											<ExternalLinkIcon className="h-4 w-4 text-neutral-500/80 dark:text-neutral-400/80" />
										</a>
									</div>
									<div
										className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grow-0 mb-4 gap-1">
										{filtered.map(file => (
											<a
												key={file.path}
												rel="noopener noreferrer"
												target="_blank"
												href={`https://github.com/withfig/autocomplete/tree/master/src/${file.path}.ts`}
												className={filtered.find(f => f.path === file.path) ? '' : 'hidden'}
											>
												<div
													className="flex flex-row justify-between items-center rounded-md p-2 text-neutral-700 bg-neutral-300 dark:text-neutral-400 dark:bg-neutral-800"
												>
													<h3
														title={name(file.path)}
														className="text-[.8rem] dark:text-neutral-200/90 truncate"
													>
														{name(file.path)}
													</h3>
													{showSize && (
														<p className="text-[.7rem] text-neutral-500/80 dark:text-neutral-300/60">
															{formatBytes(file.size)}
														</p>)
													}
												</div>
											</a>
										))}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>

			<Toaster position="bottom-right" />
		</div>
	);
}

export async function getStaticProps() {
	const res = await fetch('https://api.github.com/repos/withfig/autocomplete/git/trees/master?recursive=1');
	const data = await res.json();

	const files: FileType[] = data.tree
		.filter(file => file.type === 'blob')
		.filter(file => file.path.startsWith('src/'))
		.map(file => {
			return {
				path: file.path.replace('src/', '').replace('.ts', ''),
				size: file.size
			}
		});

	const grouped = {
		_rest: []
	};

	for (const file of files) {
		const parts = file.path.split('/');

		// If file is in a subdirectory (eg. aws/amplify), group it
		if (parts.length > 1) {
			if (grouped[parts[0]]) {
				grouped[parts[0]].push(file);
			} else {
				grouped[parts[0]] = [file];
			}

		} else grouped._rest.push(file);
	}

	return {
		props: {
			files: grouped
		},
		revalidate: 60
	};
}

function formatBytes(bytes, decimals = 1) {
	if (bytes === 0) return '0B';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

function SearchIcon({ ...props }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	);
}

function GitHubIcon({ ...props }) {
	return (
		<svg
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M7.49936 0.850006C3.82767 0.850006 0.849976 3.8273 0.849976 7.50023C0.849976 10.4379 2.75523 12.9306 5.39775 13.8104C5.73047 13.8712 5.85171 13.6658 5.85171 13.4895C5.85171 13.3315 5.846 12.9135 5.84273 12.3587C3.99301 12.7604 3.60273 11.4671 3.60273 11.4671C3.30022 10.6988 2.86423 10.4942 2.86423 10.4942C2.26044 10.0819 2.90995 10.0901 2.90995 10.0901C3.57742 10.137 3.9285 10.7755 3.9285 10.7755C4.52167 11.7916 5.48512 11.4981 5.86396 11.3279C5.92438 10.8984 6.09625 10.6053 6.28608 10.4391C4.80948 10.2709 3.25695 9.70063 3.25695 7.15241C3.25695 6.42615 3.51618 5.83298 3.94157 5.368C3.87299 5.1998 3.64478 4.52375 4.00689 3.60807C4.00689 3.60807 4.56494 3.42926 5.83538 4.28941C6.36568 4.14204 6.93477 4.06856 7.50018 4.0657C8.06518 4.06856 8.63386 4.14204 9.16498 4.28941C10.4346 3.42926 10.9918 3.60807 10.9918 3.60807C11.3548 4.52375 11.1266 5.1998 11.0584 5.368C11.4846 5.83298 11.7418 6.42615 11.7418 7.15241C11.7418 9.70716 10.1868 10.2693 8.70571 10.4338C8.94412 10.6392 9.15681 11.045 9.15681 11.6655C9.15681 12.5542 9.14865 13.2715 9.14865 13.4895C9.14865 13.6675 9.26867 13.8745 9.60588 13.8095C12.2464 12.9282 14.15 10.4375 14.15 7.50023C14.15 3.8273 11.1723 0.850006 7.49936 0.850006Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			/>
		</svg>
	);
}

function ExternalLinkIcon({ ...props }) {
	return (
		<svg
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
			/>
		</svg>
	)
}
