import { Cookie } from "lucide-react";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { List, ListItem } from "../2-atoms/List";
import { Section } from "../2-atoms/Section";
import { Span } from "../2-atoms/Span";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../2-atoms/Table";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { Hero } from "../3-molecules/Hero";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { cookieCategories } from "./CookiesPage.data.tsx";

export const CookiesPage = () => {
	return (
		<PageTemplate title="Cookie Policy">
			{/* Hero Section */}
			<Hero
				title="Cookie"
				brand="Policy"
				subtitle="Learn how SkillVector uses cookies to enhance your experience"
			/>

			{/* Cookie Policy Content — Single section with all policy cards */}
			<Section>
				<Grid maxColumns={1}>
					{/* Introduction — What cookies are and how they relate to SkillVector */}
					<Card variant="hover" aria-label="Introduction" fill>
						<CardContent>
							<Div variant="flex" className="mb-4">
								<Cookie className="h-6 w-6 text-primary" />
								<Heading variant="subsection">
									What Are Cookies and Why We Use Them
								</Heading>
							</Div>
							<Div variant="stack">
								<Text variant="muted">
									Cookies are small text files (typically containing a string of
									letters and numbers) that are placed on your device —
									computer, tablet, or mobile phone — when you visit a website.
									Cookies are widely used by website operators to make their
									sites work efficiently, provide analytics data, and remember
									your preferences. They are stored locally on your device and
									read by the server on subsequent visits.
								</Text>
								<Text variant="muted">
									SkillVector uses cookies and similar client-side storage
									technologies (including localStorage and sessionStorage)
									sparingly and only where they serve a clear purpose. We
									categorize our cookies according to their function: strictly
									necessary, functional, performance, analytics, security, and
									third-party. This policy explains what each category does,
									what specific cookies are set, how long they persist, and how
									you can manage your preferences.
								</Text>
								<Text variant="muted">
									This Cookie Policy should be read together with our Privacy
									Policy and Terms of Service, which provide additional context
									on how we handle your data. By continuing to use the Service
									after being presented with the cookie consent banner, you
									consent to the use of cookies as described in this Policy. You
									may withdraw your consent at any time — see the "Managing Your
									Cookie Preferences" section below.
								</Text>
							</Div>
						</CardContent>
					</Card>

					{/* Cookie Categories */}
					{cookieCategories.map((category) => (
						<Card
							variant="hover"
							key={category.title}
							aria-label={category.title}
							fill
						>
							<CardContent>
								<Div variant="flex" className="mb-4">
									<Div className="text-primary">{category.icon}</Div>
									<Heading variant="subsection">{category.title}</Heading>
								</Div>
								<Text variant="muted" className="mb-6">
									{category.description}
								</Text>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Cookie Name</TableHead>
											<TableHead>Purpose</TableHead>
											<TableHead>Duration</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{category.cookies.map((cookie) => (
											<TableRow key={cookie.name}>
												<TableCell variant="code">{cookie.name}</TableCell>
												<TableCell variant="muted">{cookie.purpose}</TableCell>
												<TableCell variant="muted">{cookie.duration}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					))}

					{/* Managing Cookies — Instructions for controlling cookie preferences */}
					<Card variant="hover" aria-label="Managing cookies" fill>
						<CardContent>
							<Heading variant="subsection" className="mb-4">
								Managing Your Cookie Preferences
							</Heading>
							<Div variant="stack">
								<Text variant="muted">
									You have the right to decide whether to accept or reject
									cookies (except for strictly necessary cookies, which are
									required for the Service to function). You can set or amend
									your cookie preferences at any time using the methods
									described below.
								</Text>

								{/* Browser-level cookie controls */}
								<Heading as="h3" variant="card" className="mt-6 mb-2">
									Browser Cookie Settings
								</Heading>
								<Text variant="muted">
									Most modern web browsers allow you to control cookies through
									their settings. You can typically find these options in the
									"Privacy", "Security", or "Cookies" section of your browser's
									settings or preferences menu. You can configure your browser
									to block all cookies, block only third-party cookies, or
									notify you when a cookie is being set so you can decide
									whether to accept it on a case-by-case basis.
								</Text>
								<List variant="disc">
									<ListItem>
										<Span>
											<strong>Google Chrome:</strong> Settings → Privacy and
											security → Cookies and other site data → Choose your
											preferred cookie blocking level
										</Span>
									</ListItem>
									<ListItem>
										<Span>
											<strong>Mozilla Firefox:</strong> Settings → Privacy &
											Security → Enhanced Tracking Protection → Custom → Cookies
										</Span>
									</ListItem>
									<ListItem>
										<Span>
											<strong>Apple Safari:</strong> Preferences → Privacy →
											Block all cookies, or Manage Website Data for
											site-specific control
										</Span>
									</ListItem>
									<ListItem>
										<Span>
											<strong>Microsoft Edge:</strong> Settings → Cookies and
											site permissions → Manage and delete cookies and site data
										</Span>
									</ListItem>
								</List>

								{/* Impact of disabling cookies */}
								<Heading as="h3" variant="card" className="mt-6 mb-2">
									Impact of Disabling Cookies
								</Heading>
								<Text variant="muted">
									Please be aware that disabling or blocking certain cookies may
									affect the functionality of SkillVector. In particular: if you
									disable strictly necessary cookies, you may be unable to log
									in, maintain a session, or access authenticated features. If
									you disable functional cookies, the Service may not remember
									your preferences, search history, or UI settings. If you
									disable performance and analytics cookies, we will be unable
									to collect data to improve the Service, but this will not
									affect core functionality.
								</Text>

								{/* Do Not Track */}
								<Heading as="h3" variant="card" className="mt-6 mb-2">
									Do Not Track (DNT) Signals
								</Heading>
								<Text variant="muted">
									Some browsers include a "Do Not Track" (DNT) feature that
									signals to websites that you do not wish to be tracked.
									SkillVector honors DNT signals — when a DNT signal is
									detected, we will disable all non-essential cookies and
									analytics tracking for that session. Please note that there is
									currently no uniform standard for how DNT signals should be
									interpreted, and not all browsers support or enable DNT by
									default.
								</Text>

								{/* Contact for cookie inquiries */}
								<Heading as="h3" variant="card" className="mt-6 mb-2">
									Questions About This Cookie Policy
								</Heading>
								<Text variant="muted">
									If you have questions or concerns about our use of cookies, or
									if you would like to exercise your data protection rights in
									relation to cookie data, please open an issue on the
									SkillVector GitHub repository (label it 'privacy') or consult
									the project's README for guidance. We will respond to your
									inquiry within five (5) business days.
								</Text>
							</Div>
						</CardContent>
					</Card>

					{/* Legal Basis and Updates — Regulatory compliance and change notifications */}
					<Card variant="hover" aria-label="Legal basis and updates" fill>
						<CardContent>
							<Heading variant="subsection" className="mb-4">
								Legal Basis and Policy Updates
							</Heading>
							<Div variant="stack">
								<Text variant="muted">
									Our use of cookies is governed by applicable privacy and
									electronic communications legislation, including the EU
									ePrivacy Directive (2002/58/EC, as amended by 2009/136/EC),
									the General Data Protection Regulation (EU 2016/679), the UK
									GDPR and Privacy and Electronic Communications Regulations
									(PECR), the California Consumer Privacy Act (CCPA) as amended
									by the CPRA, and other applicable national and state-level
									privacy laws.
								</Text>
								<Text variant="muted">
									We may update this Cookie Policy from time to time to reflect
									changes in technology, legislation, our business operations,
									or our cookie practices. When we make material changes, we
									will notify you by posting a prominent notice on the Service
									and updating the "Last Updated" date. We encourage you to
									review this Cookie Policy periodically to stay informed about
									our use of cookies.
								</Text>
								<Text variant="muted">
									This Cookie Policy was last updated on February 1, 2026.
								</Text>
							</Div>
						</CardContent>
					</Card>
				</Grid>
			</Section>
		</PageTemplate>
	);
};
