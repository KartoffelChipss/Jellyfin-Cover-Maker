import { Shield } from 'lucide-preact';
import Modal from '../Modal';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <header class="flex items-center justify-between p-0">
            <h1 class="text-2xl font-semibold flex items-center gap-2">
                <Shield />
                Privacy
            </h1>
            <span class="text-xs text-muted-foreground text-right">
                Last Updated:
                <br /> 2025/11/09
            </span>
        </header>
        <div class="border -my-2" />
        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">1. Overview</h2>
            <p>
                We respect your privacy and are committed to keeping your data safe. This website
                collects only minimal, non-personal information to help us understand how the site
                is used and to improve your experience.
            </p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">2. Analytics</h2>
            <p>
                We use <strong>Umami Analytics</strong>, a privacy-focused, cookie-free analytics
                tool. Umami does <strong>not</strong> collect any personally identifiable
                information (PII) or use tracking cookies.
            </p>
            <p>Information collected for analytics is anonymous and may include:</p>
            <ul class="list-disc ml-6 my-2">
                <li>Pages visited</li>
                <li>Referring website</li>
                <li>Browser type and screen size</li>
                <li>Approximate location (country or region only)</li>
                <li>Duration of visit and time of access</li>
            </ul>
            <p>This analytics data is collected anonymously and cannot be used to identify you.</p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">3. Download Tracking</h2>
            <p>
                When a poster or other file is downloaded from this website we record a{' '}
                <em>non-identifying event</em> that includes only metadata about the download. The
                recorded metadata may include:
            </p>
            <ul class="list-disc ml-6 my-2">
                <li>File name or identifier</li>
                <li>Image height, width and scale</li>
                <li>Image type (cover, poster or other)</li>
                <li>Timestamp of the download</li>
                <li>General device information (e.g., desktop or mobile)</li>
            </ul>
            <p>
                This information helps us understand which resources are most popular and improve
                our content. <strong>No personal data or IP addresses are stored.</strong>
            </p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">4. Cookies</h2>
            <p>
                This website does <strong>not</strong> use cookies or any other persistent tracking
                technologies for analytics or download tracking.
            </p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">5. Data Retention</h2>
            <p>
                Analytics and download event data are stored in aggregate form only. Individual
                visits or downloads cannot be traced back to specific users.
            </p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">6. Your Rights</h2>
            <p>
                Because no personal data is collected, there is no personal data that can be
                modified or deleted. If you have any privacy concerns or questions, contact us at{' '}
                <a class="underline" href="mailto:contact@strassburger.org">
                    contact@strassburger.org
                </a>
                .
            </p>
        </section>

        <section class="px-0">
            <h2 class="text-lg font-semibold mb-1">7. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy occasionally. The date at the top of this page
                shows the most recent update.
            </p>
        </section>
    </Modal>
);

export default PrivacyModal;
