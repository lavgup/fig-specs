import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';

export default function Dropdown({ ...props }) {
	return (
		<div className="w-56 text-right mt-2.5">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button
						className="inline-flex justify-center w-full px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-100/80 bg-neutral-400/20 rounded-md hover:bg-neutral-300/60 dark:hover:bg-neutral-300/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
						Options
						<ChevronDownIcon
							className="w-5 h-5 ml-2 -mr-1 text-neutral-400 hover:text-neutral-400/70 dark:hover:text-neutral-300"
							aria-hidden="true"
						/>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items
						className="absolute right-0 w-56 mt-2 origin-top-right bg-neutral-300 dark:bg-zinc-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="px-1 py-1 ">
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? 'bg-indigo-600/70 dark:bg-indigo-500 text-neutral-200' : 'dark:text-neutral-200'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
										onClick={() => props.setShowSize(!props.showSize)}
									>
										{active ? (
											<FileActiveIcon
												className="w-5 h-5 mr-2 stroke-indigo-300"
												aria-hidden="true"
											/>
										) : (
											<FileInactiveIcon
												className="w-5 h-5 mr-2 stroke-indigo-400"
												aria-hidden="true"
											/>
										)}
										{props.showSize ? 'Hide' : 'Show'} file sizes
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? 'bg-indigo-600/70 dark:bg-indigo-500 text-neutral-200' : 'dark:text-neutral-200'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
										onClick={() => props.setShowBuiltins(!props.showBuiltins)}
									>
										{active ? (
											<BuiltinsActiveIcon
												className="w-5 h-5 mr-2 stroke-indigo-300"
												aria-hidden="true"
											/>
										) : (
											<BuiltinsInactiveIcon
												className="w-5 h-5 mr-2 stroke-indigo-400"
												aria-hidden="true"
											/>
										)}
										{props.showBuiltins ? 'Hide' : 'Show'} Fig builtins
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}

function ChevronDownIcon({ ...props }) {
	return (
		<svg
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
		</svg>
	);
}

function FileInactiveIcon({ ...props }) {
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
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
	);
}

function FileActiveIcon({ ...props }) {
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
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
	);
}

function BuiltinsInactiveIcon({ ...props }) {
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
				d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
			/>
		</svg>
	);
}

function BuiltinsActiveIcon({ ...props }) {
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
				d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
			/>
		</svg>
	);
}

